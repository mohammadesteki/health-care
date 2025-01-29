from django.http import HttpResponse, JsonResponse

from .models import Record, GPS


def results(request):
    response = "You're looking at the results of ECG %s."
    latest_ecg_records = Record.objects.all().order_by('-id')[:50]
    print(response)
    records_data = [
        [
            record.integer_field,
            record.time_field,
        ]
        for record in latest_ecg_records
    ]
    return JsonResponse(records_data, safe=False)


def gps_results(request):
    response = "You're looking at the GPS results %s."
    latest_gps_records = GPS.objects.all().order_by('-id')[:1]
    print(response)
    records_data = [
        latest_gps_records[0].gps_latitude,
        latest_gps_records[0].gps_longitude,
    ]
    return JsonResponse(records_data, safe=False)

# Create your views here.
