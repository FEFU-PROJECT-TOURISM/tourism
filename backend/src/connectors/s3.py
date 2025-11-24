import uuid

import aioboto3

import loguru
from botocore.client import Config
from fastapi import UploadFile

from config.setting import settings


class S3Client:

    def __init__(
            self,
            access_key: str,
            secret_key: str,
            endpoint_url: str,
            bucket_name: str,
            region: str | None = None,
    ):
        loguru.logger.debug(f"endpoint_url: {endpoint_url}, bucket_name: {bucket_name}")
        # self.config = dict(
        #     endpoint_url=endpoint_url,
        #         # region_name=region,
        #         aws_access_key_id=access_key,
        #         aws_secret_access_key=secret_key,
        #         ssl_verify=False,
        #         config=Config(request_checksum_calculation="when_required",
        #                       response_checksum_validation="when_required"),
        # )
        self.config = {
            "aws_access_key_id": access_key,
            "aws_secret_access_key": secret_key,
            "endpoint_url": endpoint_url,
            "verify": False
        }
        self.bucket_name = bucket_name
        self.session = aioboto3.Session()
        self.endpoint_url = endpoint_url


    @property
    def base_link(self):
        return f"{self.endpoint_url}/{self.bucket_name}"


    def generate_filename(self, file_type) -> str:
        return f"{uuid.uuid4()}.{file_type}"


    async def upload_file(self, file: UploadFile, dir_name: str | None = None):
        file_type = file.filename.split(".")[-1]
        object_name = self.generate_filename(file_type=file_type)
        if dir_name:
            object_name = f"{dir_name}/{object_name}"
        object_name = f"{object_name}"
        try:
            async with self.session.client('s3', **self.config) as s3:
                result = await s3.put_object(Bucket=self.bucket_name, Key=object_name, Body=file.file)
            return f"{self.base_link}/{object_name}"
        except Exception as e:

            loguru.logger.exception(f"{e}")
            return None


s3_client = S3Client(
    access_key=settings.S3_ACCESS_KEY,
    secret_key=settings.S3_SECRET_KEY,
    endpoint_url=settings.S3_ENDPOINT_URL,
    bucket_name=settings.S3_BUCKET_NAME,
    # region=settings.S3_REGION,
)