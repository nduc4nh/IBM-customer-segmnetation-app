import flask
from numpy.random.mtrand import random
import pandas as pd
import numpy as np
from flask import jsonify
import pickle
from ibmcloudant.cloudant_v1 import CloudantV1
from ibmcloudant import CouchDbSessionAuthenticator
from pymongo import MongoClient
from flask import request
from flask_cors import CORS, cross_origin
import json
from local_functions import deployable_callable
from ibmcloudant.cloudant_v1 import Document
from local_arima import arima_go

LAST_ID = "1"
URI = r"mongodb+srv://anhnd:Dota2fan@cluster0.3myha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongo_client = MongoClient(URI)
mongo_db = mongo_client.get_database("products")

CLOUDANT_URL = "https://apikey-v2-1go7e481wm20t9cbozt1iwtu40pr0q8bqiro5zz82b6l:989e7571b0708a89cac8aab73990e7eb@38ea2994-be4a-4a49-a6b9-2e7fc862b20f-bluemix.cloudantnosqldb.appdomain.cloud"
CLOUDANT_APIKEY = "15woWAc-BnP_R3-TGN9NhLFlCxPQFEYIPz1V7v9PQLsi"

authenticator = CouchDbSessionAuthenticator(
    'apikey-v2-1go7e481wm20t9cbozt1iwtu40pr0q8bqiro5zz82b6l', '989e7571b0708a89cac8aab73990e7eb')
SERVICE = CloudantV1(authenticator=authenticator)
SERVICE.set_service_url(CLOUDANT_URL)
CLOUDANT_DB = "rfm_cluster_test"

TAKEN = False

with open("./data/datapickle", "rb") as f:
    df = pickle.load(f)
with open("./data/datapickle_2", "rb") as f:
    df2 = pickle.load(f)
with open("./data/datapickle_dict", "rb") as f:
    df3 = pickle.load(f)
with open("./data/datapickle_category_dict", "rb") as f:
    df4 = pickle.load(f)

MAX_WAS_BOUGHT = 5
data_recommended = df
data_cus_pro = df2
dict_products = df3
dict_pro_cate = df4

import numpy as np

class NpEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.integer):
                return int(obj)
            if isinstance(obj, np.floating):
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return super(NpEncoder, self).default(obj)

def default(obj):
    if type(obj).__module__ == np.__name__:
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return obj.item()
    raise TypeError('Unknown type:', type(obj))


def recommend_products(customerId, numpro_recommended):
    try:
        temp_cus = data_recommended.loc[customerId].sort_values(
            ascending=False)
        temp_cus_his = data_cus_pro.loc[customerId]
    except:
        return pd.DataFrame({"Error": ["Không có dữ liệu của user {}".format(customerId)]})
    list_product_recommend = []
    list_ratings = []
    list_category = []
    list_was_bought = []

    count = 0
    count_max_was_bought = 0
    for index, rating in temp_cus.items():
        if rating <= 0:
            break
        history_rating = temp_cus_his[index]

        if history_rating != 0:
            if count_max_was_bought >= MAX_WAS_BOUGHT:
                continue
            count_max_was_bought += 1
            list_was_bought.append(True)
        else:
            list_was_bought.append(False)

        count = count + 1

        product_name = dict_products[index]
        category = dict_pro_cate[product_name[0].upper()]
        list_product_recommend.append(product_name)
        list_ratings.append(np.round(rating, 2))
        list_category.append(category)

        if count >= numpro_recommended:
            break

    df_product_recommend = pd.DataFrame(data={"Product": list_product_recommend,
                                              "Rating": list_ratings,
                                              "Category": list_category,
                                              "Bought": list_was_bought})
    return df_product_recommend


app = flask.Flask(__name__)

CORS(app)


app.config["DEBUG"] = True
RFM_AND_ID = pd.read_csv(r'./data/rfm_and_id.csv')


def normalize(lower, upper):
    def norm(x):
        l, h = min(x), max(x)
        return [lower + (upper - lower) * (ele - l)/(h - l) for ele in x]
    return norm


@app.route('/user/get', methods=['GET'])
def home():
    re = list(map(lambda x: {"id": str(x)}, RFM_AND_ID.CustomerID.tolist()))
    response = jsonify(re)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/cluster/get", methods=['GET'])
def get_rfm():
    tmp = RFM_AND_ID.loc[:, ["Recency", "Frequency",
                             "MonetaryValue", "KMeans_Label"]]
    re = [{"x": tmp.loc[tmp.KMeans_Label == i].Recency.tolist(),
           "y":tmp.loc[tmp.KMeans_Label == i].Frequency.tolist(),
           "z":tmp.loc[tmp.KMeans_Label == i].MonetaryValue.tolist(),
           "label":i
           } for i in range(4)]

    response = jsonify(re)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/cluster_online/get")
def get_rfm_online():
    data = SERVICE.get_document(CLOUDANT_DB, "1").result
    rfm_df = pd.DataFrame(data["data"])
    re = [{"x": rfm_df.loc[rfm_df.KMeans_Label == i].Recency.tolist(),
           "y":rfm_df.loc[rfm_df.KMeans_Label == i].Frequency.tolist(),
           "z":rfm_df.loc[rfm_df.KMeans_Label == i].MonetaryValue.tolist(),
           "label":i
           } for i in range(4)]

    response = jsonify(re)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/recommend/<string:idx>")
def recommend_by_id(idx):
    DF = pd.read_csv("./data/data.csv",encoding="unicode_escape")
    def get_bought(idx):
        tmp = DF.loc[DF.CustomerID == float(idx)].loc[:,["Description", "Quantity"]].groupby("Description").count()
        bought = list(tmp.to_dict()["Quantity"].items())
        bought.sort(key = lambda x:x[1],reverse = True)
        items = [ele[0] for ele in bought[:5]]
        return items
    #try:
    idx = str(idx) + '.0'
    df_outcome = recommend_products(idx, 5)
    df_outcome.Product = df_outcome.Product.apply(lambda x: x[0])
    re = [df_outcome.loc[i, ["Product", "Category"]].to_dict()
            for i in range(len(df_outcome))]
    bought = get_bought(idx)
    bought_items = [{"Product":item,"Category":""} for item in bought]
    print(bought_items)
    mongo_client = MongoClient(URI)
    mongo_client.get_database("products")
    col = mongo_db["images"]

    for i, ele in enumerate(re):
        re_img = list(col.find({"name": re[i]["Product"]}))
        if len(re_img) != 0:
            print("hi")
            re[i]["src"] = re_img[0]["src"]
        else:
            re[i]["src"] = ""

    for i, ele in enumerate(bought_items):
        re_img = list(col.find({"name": ele["Product"]}))
        if len(re_img) != 0:
            print("hi")
            bought_items[i]["src"] = re_img[0]["src"]
        else:
            bought_items[i]["src"] = ""
    
    mongo_client.close()
    #except:
    #    re = []
    #    bought_items = []
    
    

    res = {"recommend":re,"bought":bought_items}
    response = jsonify(res)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/products/get_all", methods=["GET"])
def get_all_product():
    with open("./data/all_products", "rb") as f:
        re = pickle.load(f)
    response = jsonify(re)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/stimulate", methods=["POST"])
def stimulate_product():
    re = request.data
    re = json.loads(re)
    print(re)
    count = re["count"]
    items = re["items"]

    def random_time():
        date = np.random.randint(1, 11)
        month = np.random.randint(1, 11)
        year = 2010
        return "{}/{}/{}".format(month, date, year)

    def epoch_converter(readable_time):
        import calendar
        import time
        return calendar.timegm(time.strptime(readable_time, '%m/%d/%Y'))
        return "ok"

    def random_buy(count, items):
        n = len(items)
        users = []
        for i in range(count):
            t = random_time()
            idx = np.random.randint(1,100000000)
            buy = np.random.randint(1, n-1)
            

            unique = epoch_converter(t)

            for j in range(buy):
                bought = np.random.randint(1, 4)

                users.append({"InvoiceNo": unique, "InvoiceDate": t, "CustomerID": idx,
                              "Description": items[j], "UnitPrice": str(1),
                              "Country": "Vietnam", "StockCode": str(unique) + "G", "Quantity": bought})
        return pd.DataFrame(users)

    tmp = random_buy(int(count), items)
    prices = []
    for item in tmp.Description:
        try:
            prices.append(df.loc[df.Description == item].UnitPrice[0])
        except:
            prices.append(1)

    tmp.UnitPrice = prices
    payload_scoring = {"input_data": [{"values": [tmp.to_dict()

                                                  ]}]}
    deployable_callable()(payload_scoring)
    print("Done")
    return "ok"


@app.route("/arima/<string:previous>&<string:ahead>")
def arima(previous, ahead):
    re = arima_go()(int(previous), int(ahead))
    response = json.dumps(re, default = default)
    response = jsonify(json.loads(response))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    
@app.route("/arima/listen")
def arima_listen():
    import pickle
    with open("./data/arima","rb") as f:
        re = pickle.load(f)

    response = json.dumps(re, default = default)
    response = jsonify(json.loads(response))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/serve/table')
def serve():
    table = pd.read_csv("./data/rule_EIRE.csv")
    re = []
    for i in range(table.shape[0]):
        re.append(table.iloc[i,[1,2,4]].to_list())
    response = json.dumps(re, cls = NpEncoder)
    response = jsonify(json.loads(response))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
app.run(host='0.0.0.0', port='8090', threaded=True)
