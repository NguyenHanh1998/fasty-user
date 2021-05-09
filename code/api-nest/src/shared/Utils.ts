import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import * as CryptoJS from 'crypto-js';
import { SelectQueryBuilder } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export function nowInMillis(): number {
  return Date.now();
}

// Alias for nowInMillis
export function now(): number {
  return nowInMillis();
}

export function nowInSeconds(): number {
  return (nowInMillis() / 1000) | 0;
}

export function addHttps(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

export function checkIPaginationOptions(options: IPaginationOptions): boolean {
  if (options.limit == 0 || options.page == 0) {
    return false;
  }
  return true;
}

export function encrypt(data: string) {
  return CryptoJS.MD5(data).toString();
}

export function getArrayPagination<T>(totalItems: any[], options: any): Pagination<T> {
  const { limit, page } = options;

  const selectedItems = totalItems.slice((page - 1) * limit, page * limit);
  const pagination = {
    totalItems: totalItems.length,
    itemCount: selectedItems.length,
    itemsPerPage: limit,
    totalPages: Math.ceil(totalItems.length / limit),
    currentPage: page,
  };

  return new Pagination(selectedItems, pagination, null);
}

export function existValueInEnum(type: any, value: any): boolean {
  return (
    Object.keys(type)
      .filter((k) => isNaN(Number(k)))
      .filter((k) => type[k] === value).length > 0
  );
}

// Slug
export function slugConverted(text: string) {
  return (
    text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      //.replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '')
  ); // Trim - from end of text
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  // const randomName = Array(4)
  //   .fill(null)
  //   .map(() => Math.round(Math.random() * 10).toString(10))
  //   .join('');
  callback(null, `${name}${fileExtName}`);
};
