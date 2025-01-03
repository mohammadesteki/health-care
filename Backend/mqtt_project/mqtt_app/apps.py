
from django.apps import AppConfig
from .mqtt_service import mqtt_start
import threading

from .tcp_service import start_tcp_server


class MqttAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mqtt_app'

    def ready(self):
        # Start MQTT service in a separate thread
        mqtt_thread = threading.Thread(target=mqtt_start)
        mqtt_thread.daemon = True
        mqtt_thread.start()

        tcp_thread = threading.Thread(target=start_tcp_server)
        tcp_thread.daemon = True
        tcp_thread.start()