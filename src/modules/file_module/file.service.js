import { access, constants, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export class FileService {

    constructor(){
        this.directoryPath = './screens/';
    }

    async save(content) {
        const fileName = `${(new Date).getTime()}.txt`;
        const fileContent = content.join('');
        await this.scheckDir()
        await writeFile(path.join(this.directoryPath, fileName), fileContent);
    }

    async scheckDir() {
        try {
            await access(this.directoryPath, constants.R_OK | constants.W_OK);
        } catch {
            await mkdir(this.directoryPath, { recursive: true });
        }
    }
}