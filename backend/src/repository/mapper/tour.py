from model.schemas.tour import Tour
from repository.mapper.base import BaseMapper
from repository.mapper.organization import OrganizationMapper


class TourMapper(BaseMapper):
    schema = Tour

    @classmethod
    def to_schema(cls, model):
        # Создаем словарь напрямую, избегая доступа к не загруженным отношениям
        tour_dict = {
            "id": model.id,
            "name": model.name,
            "description": model.description,
        }
        
        # Добавляем организацию только если она уже загружена (eager loaded)
        # Используем безопасную проверку через inspect, чтобы избежать lazy loading
        try:
            from sqlalchemy import inspect
            insp = inspect(model)
            
            # Проверяем состояние загрузки через inspect
            if hasattr(insp, 'attrs'):
                org_attr = insp.attrs.get('organization')
                if org_attr is not None:
                    # Проверяем, загружено ли значение без вызова lazy load
                    if hasattr(org_attr, 'loaded_value'):
                        if org_attr.loaded_value is not None:
                            tour_dict["organization"] = OrganizationMapper.to_schema(org_attr.loaded_value)
                    # Если loaded_value нет, значит отношение не загружено - пропускаем
        except Exception:
            # Любая ошибка - просто пропускаем организацию
            pass
        
        return cls.schema.model_validate(tour_dict, from_attributes=True)
