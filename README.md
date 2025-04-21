# Expense Management System

<div align="center">

[English](#english) | [فارسی](#persian)

</div>

---

<div id="english">

![English](https://img.shields.io/badge/Language-English-blue)

## About

A full-stack expense management system built with Laravel and React, designed to help groups track and manage shared expenses and repayments.

## Features

### Expense Management

-   Create and track group expenses
-   Support for custom split ratios
-   Attachment support for receipts
-   Daily expense summaries

### Repayment System

-   Track repayments between members
-   Smart balance calculation
-   Repayment suggestions

### Group Management

-   Member management with custom ratios
-   Activity logging
-   Financial summaries
-   Bank account information support

### Additional Features

-   Bilingual support (English/Persian)
-   Responsive design
-   Real-time updates
-   Activity history

## Technical Stack

### Backend

-   Laravel 10
-   MySQL
-   RESTful API
-   Activity logging system

### Frontend

-   React with TypeScript
-   Vite
-   Tailwind CSS
-   Custom hooks and components

## Installation

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install PHP dependencies

```bash
composer install
```

3. Install JavaScript dependencies

```bash
npm install
```

4. Set up environment file

```bash
cp .env.example .env
php artisan key:generate
```

5. Run migrations

```bash
php artisan migrate
```

6. Start development servers

```bash
php artisan serve
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

This project is licensed under the MIT License.

</div>

---

<div id="persian" dir="rtl">

![Persian](https://img.shields.io/badge/زبان-فارسی-green)

## درباره

یک سیستم مدیریت هزینه کامل ساخته شده با Laravel و React، طراحی شده برای کمک به گروه‌ها در پیگیری و مدیریت هزینه‌های مشترک و بازپرداخت‌ها.

## امکانات

### مدیریت هزینه‌ها

-   ایجاد و پیگیری هزینه‌های گروهی
-   پشتیبانی از نسبت‌های تقسیم سفارشی
-   پشتیبانی از پیوست رسید
-   خلاصه هزینه‌های روزانه

### سیستم بازپرداخت

-   پیگیری بازپرداخت‌ها بین اعضا
-   محاسبه هوشمند مانده حساب
-   پیشنهادات بازپرداخت

### مدیریت گروه

-   مدیریت اعضا با نسبت‌های سفارشی
-   ثبت فعالیت‌ها
-   خلاصه‌های مالی
-   پشتیبانی از اطلاعات حساب بانکی

### امکانات اضافی

-   پشتیبانی دو زبانه (انگلیسی/فارسی)
-   طراحی واکنش‌گرا
-   به‌روزرسانی بلادرنگ
-   تاریخچه فعالیت‌ها

## تکنولوژی‌ها

### بک‌اند

-   Laravel 10
-   MySQL
-   RESTful API
-   سیستم ثبت فعالیت‌ها

### فرانت‌اند

-   React with TypeScript
-   Vite
-   Tailwind CSS
-   هوک‌ها و کامپوننت‌های سفارشی

## نصب

۱. کلون کردن مخزن

```bash
git clone [repository-url]
```

۲. نصب وابستگی‌های PHP

```bash
composer install
```

۳. نصب وابستگی‌های JavaScript

```bash
npm install
```

۴. تنظیم فایل محیط

```bash
cp .env.example .env
php artisan key:generate
```

۵. اجرای مهاجرت‌ها

```bash
php artisan migrate
```

۶. شروع سرورهای توسعه

```bash
php artisan serve
npm run dev
```

## مشارکت

مشارکت‌ها مورد استقبال قرار می‌گیرند! لطفاً برای ارسال pull request راحت باشید.

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.

</div>
