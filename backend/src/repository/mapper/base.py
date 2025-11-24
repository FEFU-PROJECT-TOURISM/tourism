class BaseMapper:
    schema = None

    @classmethod
    def to_schema(cls, model):
        return cls.schema.model_validate(model, from_attributes=True)
