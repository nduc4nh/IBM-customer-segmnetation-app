import flask
import pandas as pd
import numpy as np
from flask import jsonify
import pickle

with open("./data/datapickle","rb") as f:
    df = pickle.load(f)
with open("./data/datapickle_2","rb") as f:
    df2 = pickle.load(f)
with open("./data/datapickle_dict","rb") as f:
    df3 = pickle.load(f)
with open("./data/datapickle_category_dict","rb") as f:
    df4 = pickle.load(f)
MAX_WAS_BOUGHT = 5 
data_recommended = df
data_cus_pro = df2
dict_products = df3
dict_pro_cate = df4
def recommend_products(customerId, numpro_recommended):
    try:
        temp_cus = data_recommended.loc[customerId].sort_values(ascending=False)
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

        if count >= numpro_recommended: break


    df_product_recommend = pd.DataFrame(data={"Product": list_product_recommend, 
                                            "Rating": list_ratings, 
                                            "Category": list_category,
                                            "Bought": list_was_bought})
    return df_product_recommend


app = flask.Flask(__name__)
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

@app.route("/recommend/<string:idx>")
def recommend_by_id(idx):
    try:
        idx = str(idx) +'.0'
        df_outcome = recommend_products(idx,5)
        df_outcome.Product = df_outcome.Product.apply(lambda x:x[0])
        re = [df_outcome.loc[i,["Product", "Category"]].to_dict() for i in range(len(df_outcome))]
    except:
        re = []
    
    response = jsonify(re)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    

app.run(host='0.0.0.0', port='8090')
