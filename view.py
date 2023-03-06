import json

from controller import ConfigurationControl, SitesControll, LiveDataControl

from flask import Flask, session, redirect, url_for, request, render_template
from markupsafe import escape

data = Flask(__name__)
data.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
CHECKBOX_MAPPING = {'on': True,
                    'off': False}


@data.route('/', methods=["GET"])
def index():
    return render_template("first.html")


@data.route('/site/create', methods=["GET", "POST"])
def create_site():
    """

    :return: new site
    """
    if request.method == 'POST':
        SitesControll.create_site(request.form["site_name"], request.form["site_location"])
    return render_template("new_site.html")


@data.route('/conf/<site_id>/create', methods=["GET", "POST"])
def create_conf(site_id: int):
    """

    :param site_id:
    :return: new configuration
    """
    if request.method == 'POST':
        battery = {"vendor": request.form["battery_vendor"],
                   "capacity_kwh": request.form["battery_capacity_kwh"],
                   "max_power_kw": request.form["battery_max_power_kw"]
                   }
        production = {
            "pv": {"units": request.form["pv_units"], "kwp": request.form["pv_kwp"]},
            "bio": {"units": request.form["bio_units"]},
            "cro": {"units": request.form["cro_units"], "kwp": request.form["cro_kwp"]}
        }
        ConfigurationControl.create_new(site_id, battery, production)
    return render_template("new_conf.html")


@data.route('/live_data/<site_id>/create', methods=["GET", "POST"])
def create_live_data(site_id: int):
    """

    :param site_id:
    :return: new live data
    """
    if request.method == 'POST':
        LiveDataControl.create_live_data(site_id, int(request.form["soc"]),
                                         int(request.form["load_kwh"]),
                                         int(request.form["net_load_kwh"]),
                                         "pv_notification" in request.form,
                                         "bio_notification" in request.form,
                                         "cro_notification" in request.form)

    return render_template("live_data.html")


@data.route('/sites', methods=["GET"])
def get_sites():
    """

    :return: all sites in data base
    """
    header = '''

    <h> the sites List</h>
    '''

    body = ""
    for i in SitesControll.get_all():  # move all list
        body += "<p>" + str(json.dumps(i, sort_keys=True, indent=4)) + "</p>"

    return header + body


@data.route('/conf', methods=["GET"])
def get_configurations():
    """

    :return: return all conf in data base
    """
    heder = '''

    <h> the configurations List</h>
    '''

    body = ""
    for i in ConfigurationControl.get_all():  # move all list
        body += "<p>" + str(json.dumps(i, sort_keys=True, indent=4)) + "</p>"

    return heder + body


@data.route('/live_data', methods=["GET"])
def get_live_data():
    """

    :return: return all live data
    """
    header = '''

        <h> live_data List</h>
        '''

    body = ""
    for i in LiveDataControl.get_all_live_data():  # move all list
        body += "<p>" + str(json.dumps(i, sort_keys=True, indent=4)) + "</p>"

    return header + body


@data.route('/conf/<site_id>/edit', methods=['GET', "POST"])
def edit_conf(site_id: int):
    """

    :param site_id: 
    :return: edit configuration
    """

    if request.method == 'POST':
        if request.form['submit'] == 'save':
            battery = {"vendor": request.form["battery_vendor"],
                       "capacity_kwh": request.form["battery_capacity_kwh"],
                       "max_power_kw": request.form["battery_max_power_kw"]
                       }
            production = {
                "pv": {"units": request.form["pv_units"], "kwp": request.form["pv_kwp"]},
                "bio": {"units": request.form["bio_units"]},
                "cro": {"units": request.form["cro_units"], "kwp": request.form["cro_kwp"]}
            }
            ConfigurationControl.edit_conf(site_id, battery, production)
            conf = ConfigurationControl.get_by_id(site_id)
            return render_template("edit_conf.html", conf=conf[0])
    if request.method == 'GET':
        conf = ConfigurationControl.get_by_id(site_id)
        if conf:
            print(conf)
            return render_template("edit_conf.html", conf=conf[0])
        else:
            return 'Error loading #{id}'.format(id=site_id)


@data.route('/live_data/<site_id>/edit', methods=['GET', "POST"])
def edit_live_data(site_id: int):
    """

    :param site_id:
    :return: edit live data
    """
    print(site_id)
    if request.method == 'POST':
        if request.form['submit'] == 'save':
            LiveDataControl.edit_live_data(site_id, int(request.form["soc"]),
                                           int(request.form["load_kwh"]),
                                           int(request.form["net_load_kwh"]),
                                           "pv_notification" in request.form,
                                           "bio_notification" in request.form,
                                           "cro_notification" in request.form)
            return render_template("edit_live_data.html")
    if request.method == 'GET':
        return render_template("edit_live_data.html")
