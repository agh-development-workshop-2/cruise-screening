from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import LiteratureReview
from .serializers import LiteratureReviewSerializer
from rest_framework import status

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
