import fs from "fs"
import path from "path"

export class FileService{


    save(content, directory){
        const directoryPath = './screens/'; 
        const fileName = `${(new Date).getTime()}.txt`;
        const fileContent = content.join(', ');
        fs.writeFile(path.join(directoryPath, fileName), fileContent, (err) => {
            if (err) {
                console.error('Произошла ошибка при создании файла:', err);
                return;
            }
            console.log('Файл успешно создан и сохранен.');
        });
    }
}