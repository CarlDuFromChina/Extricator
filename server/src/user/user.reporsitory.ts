import { Injectable } from "@nestjs/common";
import { access, readFile, writeFile, constants } from 'fs';
import { User } from "./user.entity";

/**
 * 用户仓储（增删改查）
 */
 @Injectable()
export class UserReporsitory {
  private readonly file = 'users.json';

  constructor() {
    access(this.file, constants.F_OK, err => {
      if (err) {
        writeFile(this.file, JSON.stringify([]), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  }
  
  getAllData(): Promise<Array<User>> {
    return new Promise((resolve, reject) => {
      readFile(this.file, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          var users = JSON.parse(data.toString()) as Array<User>;
          resolve(users);
        }
      });
    });
  }

  getData(code: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      var users = await this.getAllData();
      const result = users.filter(item => item.code === code);
      resolve(result.length > 0 ? result[0] : null);
    })
  }

  deleteData(code: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      var users = await this.getAllData();
      users = users.filter(item => item.code !== code);
      writeFile(this.file, JSON.stringify(users), err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      })
    });
  }

  writeData(user: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.getAllData().then(users => {
        users.push(user);
        writeFile(this.file, JSON.stringify(users), err => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      })
    })
  }

  updateData(user: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.getAllData().then(users => {
        var index = users.findIndex(item => item.code === user.code);
        if (index !== -1) {
          users[index] = user;
        }
        writeFile(this.file, JSON.stringify(users), err => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      })
    })
  }
} 
