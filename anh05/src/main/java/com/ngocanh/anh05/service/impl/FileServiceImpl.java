// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service.impl;

import com.ngocanh.anh05.service.FileService;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileServiceImpl implements FileService {
   public FileServiceImpl() {
   }

   public String uploadImage(String path, MultipartFile file) throws IOException {
      String originalFileName = file.getOriginalFilename();
      String randomId = UUID.randomUUID().toString();
      String fileName = randomId.concat(originalFileName.substring(originalFileName.lastIndexOf(46)));
      String filePath = path + File.separator + fileName;
      File folder = new File(path);
      if (!folder.exists()) {
         folder.mkdir();
      }

      Files.copy(file.getInputStream(), Paths.get(filePath), new CopyOption[0]);
      return fileName;
   }

   public InputStream getResource(String path, String fileName) throws FileNotFoundException {
      String filePath = path + File.separator + fileName;
      InputStream inputStream = new FileInputStream(filePath);
      return inputStream;
   }
}
