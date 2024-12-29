
from django.apps import AppConfig
from .mqtt_service import mqtt_start
import threading


class MqttAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mqtt_app'

    def ready(self):
        # Start MQTT service in a separate thread
        mqtt_thread = threading.Thread(target=mqtt_start)
        mqtt_thread.daemon = True
        mqtt_thread.start()