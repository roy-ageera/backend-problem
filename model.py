import uuid
from dataclasses import dataclass
import time
from tinydb import TinyDB, Query, table
from datetime import datetime

SitesDBPath = 'sites.json'
SitesDBTable = TinyDB(SitesDBPath)
sites_table = SitesDBTable.table('sites')

ConfigurationDBPath = "configuration.json"
ConfigurationDBTable = TinyDB(ConfigurationDBPath)
conf_table = ConfigurationDBTable.table('Configurations')

live_dataDBPath = 'live_data.json'
live_dataDBTable = TinyDB(live_dataDBPath)
live_data_table = live_dataDBTable.table('live_data')


class SitesDBWrapper:

    @classmethod
    def get_by_id(cls, site_id: int):
        """

        :param site_id:
        :return: current site
        """
        return sites_table.search(Query().site_id.matches(str(site_id)))

    @classmethod
    def create_site(cls, name: str, location: str):
        """
        create a new site

        :return: new site
        """
        sites_table.insert({'name': name,
                            'location': location,
                            'id': str(uuid.uuid4().int)})

    @classmethod
    def get_all(cls) -> list[sites_table]:
        """
        get all the list in data base
        :return: all the list of site
        """
        return sites_table.all()


class ConfigurationDBWrapper:
    @classmethod
    def get_by_id(cls, site_id: int):
        """
        current site
        :return: a site acordind to a specific id
        """
        return conf_table.search(Query().id.matches(str(site_id)))

    @classmethod
    def create_configuration(cls, site_id: int, battery: dict, production: dict):
        """

        :param site_id:
        :param battery:
        :param production:
        :return: new configuration
        """
        conf_table.insert({
            'id': str(site_id),
            "battery": battery,
            "production": production})

    @classmethod
    def update_battery_configuration(cls, site_id: int, battery: dict):
        """

        :param battery:
        :param site_id:
        :return: an updated battery configuration
        """

        conf_table.update({'battery': battery},
                          Query().id.matches(str(site_id)))

    @classmethod
    def update_production_configuration(cls, site_id: int, production: dict):
        """
        :param production:
        :param site_id:
        :return:: an updated prodaction configuration

        """

        conf_table.update({'production': production},
                          Query().site_id.matches(str(site_id)))

    @classmethod
    def get_all(cls) -> list[conf_table]:
        """
        :return: get all the configurations in data base

        """
        return conf_table.all()


class Live_dataDBWrapper:
    current_datetime = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")

    @classmethod
    def create_live_data(cls, site_id: int, soc: int, load_kwh: int, net_load_kwh: int, pv_notification: bool,
                         bio_notification: bool,
                         cro_notification: bool):
        """

        :param site_id:
        :param soc:
        :param load_kwh:
        :param net_load_kwh:
        :param pv_notification:
        :param bio_notification:
        :param cro_notification:
        :return: a new live data
        """
        live_data_table.insert({
            "site_id": str(site_id),
            "dt - stamp": [cls.current_datetime],
            "soc": [soc],
            "load_kwh": [load_kwh],
            "net_load_kwh": [net_load_kwh],
            "pv_notification": [pv_notification],
            "bio_notification": [bio_notification],
            "cro_notification": [cro_notification]})

    @classmethod
    def update_live_data(cls, site_id: int, soc: int, load_kwh: int, net_load_kwh: int, pv_notification: bool,
                         bio_notification: bool,
                         cro_notification: bool):
        """

        :param site_id:
        :param soc:
        :param load_kwh:
        :param net_load_kwh:
        :param pv_notification:
        :param bio_notification:
        :param cro_notification:
        :return: an updated live data
        """
        site_livedata = cls.get_by_id(site_id)
        if not site_livedata:
            raise ValueError("not valid site id")
        site_livedata = site_livedata[0]
        site_livedata["dt - stamp"].append(cls.current_datetime)
        site_livedata["soc"].append(soc)
        site_livedata["load_kwh"].append(load_kwh)
        site_livedata["net_load_kwh"].append(net_load_kwh)
        site_livedata["pv_notification"].append(pv_notification)
        site_livedata["bio_notification"].append(bio_notification)
        site_livedata["cro_notification"].append(cro_notification)
        User = Query()
        live_data_table.update(site_livedata,
            User["site_id"] == site_id)
        return True

    @classmethod
    def get_all(cls) -> list[live_data_table]:
        """

        :return: get all the live data in data base
        """
        return live_data_table.all()

    @classmethod
    def get_by_id(cls, site_id: int):
        """

        :return: a specific live data according to id
        """
        return live_data_table.search(Query().site_id.matches(str(site_id)))
