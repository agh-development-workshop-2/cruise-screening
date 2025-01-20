from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

from organisations.models import Organisation, OrganisationMember
from literature_review.models import LiteratureReview
from users.models import User
from literature_review.serializers import LiteratureReviewSerializer
from organisations.serializers import (
    OrganisationSerializer,
    OrganisationMemberSerializer,
)
from django.http import JsonResponse


def user_organisations(request, user_id):
    """
    Retrieve organisations for a specific user.
    """

    user = get_object_or_404(User, pk=user_id)


    organisations = Organisation.objects.filter(members__member=user)


    serializer = OrganisationSerializer(organisations, many=True)


    return JsonResponse(serializer.data, safe=False)


class UserOrganisationsView(APIView):
    def get(self, request):
        user = request.user
        organisations = Organisation.objects.filter(members__member=user)
        
        return Response({"organisations": [org.name for org in organisations]}, status=status.HTTP_200_OK)

class UserSearchView(APIView):
    """Wyszukiwanie użytkowników na podstawie zapytania."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("query", "").strip()
        if not query:
            return Response({"error": "Query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(username__icontains=query)[:10]  
        data = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
        return Response(data, status=status.HTTP_200_OK)


class OrganisationCreateView(APIView):
    """Tworzenie nowej organizacji z listą administratorów."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        if not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can create organisations."},
                status=status.HTTP_403_FORBIDDEN,
            )

        title = request.data.get("title")
        description = request.data.get("description")
        admin_ids = request.data.get("admins", [])

        if not title or not description:
            return Response(
                {"error": "Title and description are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    
        admins = User.objects.filter(id__in=admin_ids)
        if not admins.exists():
            return Response(
                {"error": "At least one valid administrator is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

  
        organisation = Organisation.objects.create(title=title, description=description)

        for admin in admins:
            OrganisationMember.objects.create(
                organisation=organisation, member=admin, role="AD"
            )

   
        serializer = OrganisationSerializer(organisation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrganisationListView(APIView):
    """Retrieve all organisations."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        organisations = Organisation.objects.all()
        serializer = OrganisationSerializer(organisations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can create organisations."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = OrganisationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrganisationDetailView(APIView):
    """Retrieve, update or delete an organisation."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, organisation_id):
        organisation = get_object_or_404(Organisation, pk=organisation_id)
        members = OrganisationMember.objects.filter(organisation=organisation)
        if not request.user.is_superuser and request.user not in organisation.members.all():
            return redirect("home")

        if request.user.is_superuser:
            current_user_role = "AD"
        else:
            current_user_role = OrganisationMember.objects.filter(
                member=request.user, organisation=organisation
            ).values_list("role", flat=True)[0]

        if current_user_role in ["AD", "ME"]:
            literature_reviews = LiteratureReview.objects.filter(organisation=organisation)
        else:
            literature_reviews = []

     
        return Response(
            {
                "organisation": OrganisationSerializer(organisation).data,
                "members": [OrganisationMemberSerializer(member).data for member in members],
                "current_user_role": current_user_role,
                "literature_reviews": literature_reviews,
            },status=status.HTTP_200_OK
        )

    def delete(self, request, organisation_id):
        organisation = get_object_or_404(Organisation, pk=organisation_id)
        if not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can delete organisations."},
                status=status.HTTP_403_FORBIDDEN,
            )
        organisation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrganisationMemberView(APIView):
    """Manage members of an organisation."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, organisation_id):
        organisation = get_object_or_404(Organisation, pk=organisation_id)
        members = OrganisationMember.objects.filter(organisation=organisation)
        serializer = OrganisationMemberSerializer(members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, organisation_id):
        organisation = get_object_or_404(Organisation, pk=organisation_id)

        user_id = request.data.get("user_id")
        role = request.data.get("role", "ME")  

        if not user_id:
            return Response(
                {"error": "user_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if role not in dict(OrganisationMember.roles_choices):
            return Response(
                {"error": f"Invalid role. Valid roles are: {[choice[0] for choice in OrganisationMember.roles_choices]}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(User, pk=user_id)

        
        if OrganisationMember.objects.filter(organisation=organisation, member=user).exists():
            return Response(
                {"error": "User is already a member of this organisation."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        
        organisation_member = OrganisationMember(
            organisation=organisation,
            member=user,
            role=role
        )
        organisation_member.save()

        return Response(
            {
                "id": organisation_member.id,
                "organisation_id": organisation.id,
                "member_id": user.id,
                "role": organisation_member.role
            },
            status=status.HTTP_201_CREATED
        )

    def delete(self, request, organisation_id, user_id):
        organisation = get_object_or_404(Organisation, pk=organisation_id)
        if not request.user.is_superuser and "AD" not in OrganisationMember.objects.filter(
            member=request.user, organisation=organisation
        ).values_list("role", flat=True):
            return Response(
                {"error": "You do not have permission to remove members from this organisation."},
                status=status.HTTP_403_FORBIDDEN,
            )
        user = get_object_or_404(User, pk=user_id)
        
        try:
            org_member = OrganisationMember.objects.get(organisation=organisation, member=user)
            org_member.delete()
        except OrganisationMember.DoesNotExist:
            return Response(
                {"error": "This user is not a member of the organisation."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class LiteratureReviewView(APIView):
    """Retrieve literature reviews for an organisation."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, organisation_id):
        organisation = get_object_or_404(Organisation, pk=organisation_id)
        if not request.user.is_superuser and "AD" not in OrganisationMember.objects.filter(
            member=request.user, organisation=organisation
        ).values_list("role", flat=True):
            return Response(
                {"error": "You do not have permission to access reviews for this organisation."},
                status=status.HTTP_403_FORBIDDEN,
            )
        reviews = LiteratureReview.objects.filter(organisation=organisation)
        serializer = LiteratureReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
