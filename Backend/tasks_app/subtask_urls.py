from rest_framework.routers import DefaultRouter

from .views import SubtaskViewSet

router = DefaultRouter()
router.register('', SubtaskViewSet, basename='subtask')

urlpatterns = router.urls
