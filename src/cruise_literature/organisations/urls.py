from django.urls import path

from . import views

app_name = "organisations"
urlpatterns = [
    path(
        "view_all_organisations/",
        views.view_all_organisations,
        name="view_all_organisations",
    ),
    path(
        "view_organisation/<int:organisation_id>/",
        views.view_organisation,
        name="view_organisation",
    ),
    path(
        "edit_organisation/<int:organisation_id>/",
        views.view_organisation,
        name="edit_organisation",
    ),  # TODO: Implement edit_organisation
    path(
        "delete_organisation/<int:organisation_id>/",
        views.delete_organisation,
        name="delete_organisation",
    ),
    path(
        "view_organisation/<int:organisation_id>/add_member/",
        views.add_member,
        name="add_member",
    ),
    path(
        "remove_member/<int:organisation_id>/<int:user_id>",
        views.remove_member,
        name="remove_member",
    ),
    path("create_organisation/", views.create_organisation, name="create_organisation"),
    path(
        "find_organisations/<int:user_id>",
        views.find_organisations,
        name="find_organisation",
    ),
    path(
        "api/find_organisations/<int:user_id>",
        views.find_organisations,
        name="find_organisation_api",
    ),
]
