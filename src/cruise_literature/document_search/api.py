from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .engine_logger import EngineLogger
from .models import SearchEngine
from .views import query_search_results
from django.http import HttpResponse
import json

engine_logger = EngineLogger()


@api_view(["GET"])
@permission_classes([AllowAny])
def api_search_results(request):
    matched_wiki_page, search_result, _, paginator, search_time, search_query = query_search_results(
        request)

    context = {
        "search_result": [r.to_dict() for r in search_result],
        "matched_wiki_page": matched_wiki_page.to_dict(),
        "unique_searches": len(search_result),
        "search_time": f"{search_time:.2f}",
        "search_query": search_query,
        "search_type": "",  # TODO - should be actual search type
        "page_size": paginator.per_page
    }

    return HttpResponse(json.dumps(context), content_type='application/json')


@api_view(["GET"])
@permission_classes([AllowAny])
def api_search_engines(request):
    search_engines = SearchEngine.objects.filter(is_available_for_review=True).values_list(
        "id", "name"
    )

    print(search_engines)

    context = {
        "search_engines": [engine[1] for engine in search_engines],
    }

    return HttpResponse(json.dumps(context), content_type='application/json')
