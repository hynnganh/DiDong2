// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.ngocanh.anh05.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
   String uploadImage(String path, MultipartFile file) throws IOException;

   InputStream getResource(String path, String fileName) throws FileNotFoundException;
}
