import json

from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import LiteratureReview
from .serializers import LiteratureReviewSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def literature_review_list_api(request):
    """
    Fetch literature reviews for the authenticated user.
    """
    # Filter reviews where the user is a member
    literature_reviews = LiteratureReview.objects.filter(members=request.user)
    serializer = LiteratureReviewSerializer(literature_reviews, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_literature_review(request):
    pass


@api_view(["GET"])
@permission_classes([AllowAny])
def query_review_types(request):
    context = {
        "review_types": {review_type[0]: review_type[1] for review_type in LiteratureReview.REVIEW_TYPES}
    }
    return HttpResponse(json.dumps(context), content_type='application/json')
