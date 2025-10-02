    package ma.jamcha.jamcha.controllers;


    import io.minio.GetObjectArgs;
    import ma.jamcha.jamcha.services.MinioService;
    import okhttp3.Response;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.core.io.InputStreamResource;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.MediaType;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.tags.Tag;

    import java.util.HashMap;
    import java.util.Map;
    import java.util.UUID;

    @Tag(name = "Minio", description = "Minio management APIs")
    @RestController
    @RequestMapping("/api/files")
    public class MinioController {

        @Value("${minio.bucketName}")
        private String bucketName;

        @Autowired
        private MinioService minioService;


        @PostMapping("/upload")
        public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
            try {
                if(file.isEmpty()){
                    return new ResponseEntity<>("The file is empty" ,HttpStatus.BAD_REQUEST );
                }

                String originalFilename = file.getOriginalFilename();
                String fileExtension = "";
                String filename="";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                     filename=originalFilename.substring(0,originalFilename.indexOf("."));
                }

                String uniqueFilename= filename+"_"+UUID.randomUUID().toString()+fileExtension;

                minioService.uploadFile(uniqueFilename, file.getInputStream(), file.getContentType(),file.getSize());
                Map<String,Object> response=new HashMap<>();

                response.put("success", true);
                response.put("message", "File uploaded successfully");
                response.put("filename", uniqueFilename);
                response.put("originalFilename", originalFilename);
                response.put("size", file.getSize());
                response.put("contentType", file.getContentType());

                return ResponseEntity.ok(response.toString());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
            }
        }

        //download file
        @GetMapping("/download/{fileName}")
        public ResponseEntity<?> downloadFile(@PathVariable String fileName) {
            try {
                if(!minioService.fileExists(fileName)){
                    return new ResponseEntity<>("the file doesn't exist", HttpStatus.NOT_FOUND);
                }

                InputStreamResource resource = new InputStreamResource(
                        minioService.downloadFile(fileName)
                        );

                var fileInfo = minioService.getFileInfo(fileName);
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
                 headers.add(HttpHeaders.CONTENT_LENGTH,String.valueOf(fileInfo.size()));
                return ResponseEntity.ok()
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } catch (Exception e) {
                return new ResponseEntity<>("There was an error ",HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        //delete file
        @DeleteMapping("/delete/{fileName}")
        public ResponseEntity<?> deleteFile(@PathVariable String fileName){
            try{
                if(!minioService.fileExists(fileName)){
                    return new ResponseEntity<>("the file doesn't exist", HttpStatus.NOT_FOUND);
                }
                minioService.deleteFile(fileName);
                return new ResponseEntity<>("File deleted successfully",HttpStatus.NO_CONTENT);
            }catch(Exception e){
                return new ResponseEntity<>("There was an error ",HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        //get file information
        @GetMapping("/info/{fileName}")
        public ResponseEntity<?> getFileInfo(@PathVariable String fileName){
            try{
                if(!minioService.fileExists(fileName)){
                    return new ResponseEntity<>("the file doesn't exist", HttpStatus.NOT_FOUND);
                }
                var fileInfo=minioService.getFileInfo(fileName);
                Map<String, Object> response = new HashMap<>();
                response.put("filename", fileName);
                response.put("size", fileInfo.size());
                response.put("contentType", fileInfo.contentType());
                response.put("lastModified", fileInfo.lastModified());
                response.put("etag", fileInfo.etag());

                return ResponseEntity.ok(response);
            }catch(Exception e){
                return new ResponseEntity<>("There was an error ",HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    }
