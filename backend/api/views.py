import os
import traceback
import joblib

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .gemini_client import ask_gemini, SYSTEM_PROMPT


from .serializers import (
    PredictInputSerializer,
    RegisterSerializer,
    UserSerializer,
    ChatInputSerializer,
)
from ml.predictor import predict
from .openai_client import ask_openai, SYSTEM_PROMPT


class HealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


class CategoriesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../backend
        encoder_path = os.path.join(base_dir, "ml", "encoder.joblib")
        enc = joblib.load(encoder_path)

        return Response({
            "Occupation_values": list(enc.categories_[0]),
            "City_Tier_values": list(enc.categories_[1]),
        })


class PredictView(APIView):
    permission_classes = [IsAuthenticated]  # Postman DOIT envoyer Bearer token

    def post(self, request):
        serializer = PredictInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = predict(serializer.validated_data)
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(
                {"error": "Internal server error", "trace": traceback.format_exc()},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChatInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_msg = serializer.validated_data["message"]
        conv_id = serializer.validated_data.get("conversation_id", "")

        context = serializer.validated_data.get("context")

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if context:
            messages.append({
                "role": "system",
                "content": f"Contexte (résultats du modèle de prédiction): {context}"
            })

        messages.append({"role": "user", "content": user_msg})

        try:
            reply = ask_gemini(messages)
            return Response({"conversation_id": conv_id, "reply": reply}, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {"error": "Chat service unavailable", "trace": traceback.format_exc()},
                status=status.HTTP_502_BAD_GATEWAY
            )
