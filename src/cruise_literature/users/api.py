from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .serializers import RegisterSerializer, EditUserSerializer, UserProfileSerializer, LanguageSerializer, KnowledgeAreaSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Language, KnowledgeArea  

# Register API
@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login API
@api_view(["POST"])
@permission_classes([AllowAny])
def login_request_api(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)  # JWT Token generation
        return Response({
            "message": "Login successful!",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_200_OK)
    return Response({"error": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)


# Logout API
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_request_api(request):
    logout(request)
    return Response({"message": "Logged out successfully!"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile_api(request):
    user = request.user
    serializer = UserProfileSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def edit_profile_api(request):
    user = request.user
    serializer = EditUserSerializer(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_user_api(request):
    user = request.user
    user.delete()
    return Response({"message": "Account deleted successfully."}, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_languages(request):
    """
    Endpoint to fetch all available languages.
    """
    languages = Language.objects.all()
    serializer = LanguageSerializer(languages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_knowledge_areas(request):
    """
    Endpoint to fetch all available knowledge areas.
    """
    knowledge_areas = KnowledgeArea.objects.all()
    serializer = KnowledgeAreaSerializer(knowledge_areas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
