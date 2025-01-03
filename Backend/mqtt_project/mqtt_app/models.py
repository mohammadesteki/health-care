# mqtt_app/models.py

from django.db import models

class PatientData(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    heart_rates = models.JSONField()  # Stores ECG array data
    fall_detected = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Data from {self.timestamp}"

class Record(models.Model):
    integer_field = models.IntegerField()
    time_field = models.DateTimeField()

    def __str__(self):
        return f"Record({self.integer_field}, {self.time_field})"

class Fallen(models.Model):
    last_fallen_time = models.TimeField()

    def __str__(self):
        return f"Fallen({self.last_fallen_time})"
