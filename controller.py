from model import SitesDBWrapper, ConfigurationDBWrapper, Live_dataDBWrapper


class SitesControll:
    """
    controler level to send from view to model and make the logic
    """

    @classmethod
    def get_site(cls, site_id: int):
        """
        :param site_id:
        :return: get a site by id
        """
        return SitesDBWrapper.get_by_id(site_id=site_id)

    @classmethod
    def create_site(cls, name: str, location: str) -> None:
        """
        :param name:
        :param location:
        :return: create new site
        """
        SitesDBWrapper.create_site(name=name, location=location)

    @classmethod
    def get_all(cls):
        """
        :return: get all sites
        """
        return SitesDBWrapper.get_all()


class ConfigurationControl:
    """
        controler level to send from view to model and make the logic
        """

    @classmethod
    def get_by_id(cls, site_id: int) -> list[dict] or bool:
        """
        :param site_id:
        :return: get configuration by id
        """
        if ConfigurationDBWrapper.get_by_id(site_id):
            return ConfigurationDBWrapper.get_by_id(site_id)
        else:
            return False

    @staticmethod
    def configuration_validation(battery: dict, production: dict):
        """

        :param battery:
        :param production:
        :return: verify if all the input element are acording to the rulls
        """
        if battery["vendor"] not in {"Tesla", "KATL"}:
            raise ValueError("The vendor should be Tesla or KATL only")
        if int(battery["capacity_kwh"]) < 0:
            raise ValueError("The capacity_kwh cannot be negative")
        if int(battery["max_power_kw"]) < 0:
            raise ValueError("The max_power_kw cannot be negative")
        if int(production["pv"]["units"]) < 0 or int(production["bio"]["units"]) < 0 or int(
                production["cro"]["units"]) < 0:
            raise ValueError("The units cannot be negative")
        return True

    @classmethod
    def create_new(cls, site_id: int, battery: dict, production: dict):
        """
        :param site_id:
        :param battery:
        :param production:
        :return: create new configuration
        """
        if cls.configuration_validation(battery, production) and SitesDBWrapper.get_by_id(site_id):
            ConfigurationDBWrapper.create_configuration(site_id, battery, production)
        else:
            raise ValueError("validation failed ")

    @classmethod
    def edit_conf(cls, site_id: int, battery: dict, production: dict):
        """

        :param site_id:
        :param battery:
        :param production:
        :return: edit a configuration
        """
        config = cls.get_by_id(site_id)
        if not config:
            raise ValueError("not valid conf id")
        elif cls.configuration_validation(battery, production) and cls.get_by_id(site_id):

            ConfigurationDBWrapper.update_battery_configuration(site_id, battery)
            ConfigurationDBWrapper.update_production_configuration(site_id, production)
        else:
            raise ValueError("validation failed ")

    @classmethod
    def get_all(cls):
        """
        :return: get all the configurations
        """
        return ConfigurationDBWrapper.get_all()


class LiveDataControl:
    @staticmethod
    def live_data_validation(soc: int, load_kwh: int, net_load_kwh: int, pv_notification: bool, bio_notification: bool,
                             cro_notification: bool):
        """

        :param soc:
        :param load_kwh:
        :param net_load_kwh:
        :param pv_notification:
        :param bio_notification:
        :param cro_notification:
        :return: verify if all the input element are acording to the rulls
        """
        if soc < 0 or soc > 100:
            raise ValueError("the soc has to be between 0 and 100 only")
        if not isinstance(pv_notification, bool):
            raise ValueError("notifications have to be boolean ")
        if not isinstance(bio_notification, bool):
            raise ValueError("notifications have to be boolean ")
        if not isinstance(cro_notification, bool):
            raise ValueError("notifications have to be boolean ")
        if load_kwh < 0:
            raise ValueError("The load_kwh cannot be negative")
        if net_load_kwh < 0:
            raise ValueError("The net_load_kwh cannot be negative")
        return True

    @classmethod
    def create_live_data(cls, site_id: int, soc: int, load_kwh: int, net_load_kwh: int, pv_notification: bool,
                         bio_notification: bool, cro_notification: bool):
        """

        :param site_id:
        :param soc:
        :param load_kwh:
        :param net_load_kwh:
        :param pv_notification:
        :param bio_notification:
        :param cro_notification:
        :return: create new live data
        """
        if cls.live_data_validation(soc, load_kwh, net_load_kwh, pv_notification, bio_notification,
                                    cro_notification) and SitesDBWrapper.get_by_id(site_id):
            Live_dataDBWrapper.create_live_data(site_id, soc, load_kwh, net_load_kwh, pv_notification, bio_notification,
                                                cro_notification)
        else:
            raise ValueError("validation failed ")


    @classmethod
    def edit_live_data(cls, site_id: int, soc: int, load_kwh: int, net_load_kwh: int, pv_notification: bool,
                       bio_notification: bool, cro_notification: bool):
        """

        :param site_id:
        :param soc:
        :param load_kwh:
        :param net_load_kwh:
        :param pv_notification:
        :param bio_notification:
        :param cro_notification:
        :return: edit a live data
        """
        if cls.live_data_validation(soc, load_kwh, net_load_kwh, pv_notification, bio_notification, cro_notification) and cls.get_by_id(site_id):
            Live_dataDBWrapper.update_live_data(site_id, soc, load_kwh, net_load_kwh, pv_notification, bio_notification,
                                                cro_notification)
        else:
            raise ValueError("validation failed ")

    @classmethod
    def get_all_live_data(cls):
        """

        :return: all live data
        """
        return Live_dataDBWrapper.get_all()

    @classmethod
    def get_by_id(cls, site_id):
        """

        :param site_id:
        :return: get a live data acordind to a specific id
        """
        Live_dataDBWrapper.get_by_id(site_id=site_id)
