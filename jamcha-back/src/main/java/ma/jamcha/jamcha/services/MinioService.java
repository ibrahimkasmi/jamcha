package ma.jamcha.jamcha.services;

import io.minio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class MinioService {

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucketName}")
    private String bucketName;

    //checking if the file exist
    public boolean fileExists(String objectName){
        try{
            minioClient.statObject(
                    StatObjectArgs.builder().bucket(bucketName).object(objectName).build()
            );
            return true;
        } catch (Exception e) {
          return false;
        }
    }
    // ensuring if the bucket exist
    private void ensureBacketExists()throws Exception{
        boolean bucketExists=minioClient.bucketExists(
                BucketExistsArgs.builder().bucket(bucketName).build()
        );
        if(!bucketExists){
            minioClient.makeBucket(
                    MakeBucketArgs.builder().bucket(bucketName).build()
            );
        }
    }

    // uploading the file to minio
    public void uploadFile(String objectName, InputStream inputStream, String contentType, long size) throws Exception {
        ensureBacketExists();
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .stream(inputStream, inputStream.available(), -1)
                        .contentType(contentType)
                        .build());
    }

     // download the file from minio
    public InputStream downloadFile(String objectName) throws Exception {
        return minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .build());
    }
   // delete the file from minio
    public void deleteFile(String objectName) throws Exception {
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .build());
    }
    //get file information
    public StatObjectResponse getFileInfo(String fileName) throws Exception{
        return minioClient.statObject(
                StatObjectArgs.builder().bucket(bucketName).object(fileName).build()
        );
    }
}