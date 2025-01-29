from django.contrib import admin

from .models import Record
from .models import Fallen
from .models import GPS
# Register your models here.
admin.site.register(Record)
admin.site.register(Fallen)
admin.site.register(GPS)