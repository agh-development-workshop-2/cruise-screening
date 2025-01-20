from django.urls import path
from . import views
from . import api


urlpatterns = [
    path("search", views.search_results, name="search_results"),
    path("api/search", api.api_search_results, name="api_search_results"),
    path("api/search_engines", api.api_search_engines, name="api_search_engines")
]
