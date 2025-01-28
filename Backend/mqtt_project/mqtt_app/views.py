from django.http import HttpResponse, JsonResponse

from .models import Record

def results(request):
    response = "You're looking at the results of ECG %s."
    latest_ecg_records = Record.objects.all().order_by('-time_field')[:50]
    print(response)
    records_data = [
        [
            record.integer_field,
            record.time_field,  # Format `time_field` appropriately
        ]
        for record in latest_ecg_records
    ]
    # records_data = [
    #     [100, 100], [200, 200]
    # ]
    return JsonResponse(records_data, safe=False)

# Create your views here.
