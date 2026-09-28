# 📘 AI CODING RULES — NestJS + Next.js + MongoDB + Docker

> Tài liệu này là **bộ quy tắc bắt buộc** cho AI (Claude, Cursor, Copilot...) và lập trình viên khi xây dựng dự án.
> Áp dụng cho: **Landing Page**, **Page chức năng cơ bản** (CRUD, form, dashboard), **Page logic** (nghiệp vụ, xác thực, phân quyền).
>
> ⚠️ AI PHẢI đọc toàn bộ file này trước khi viết code. Nếu yêu cầu của người dùng mâu thuẫn với rule, hãy hỏi lại trước khi làm.

---

## 0. Mục lục

1. [Tech Stack](#1-tech-stack)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Quy tắc chung cho AI](#3-quy-tắc-chung-cho-ai)
4. [Clean Code & Đặt tên](#4-clean-code--đặt-tên)
5. [Quy tắc chú thích tiếng Việt](#5-quy-tắc-chú-thích-tiếng-việt)
6. [Backend — NestJS](#6-backend--nestjs)
7. [Database — MongoDB](#7-database--mongodb)
8. [Bảo mật JWT (QUAN TRỌNG)](#8-bảo-mật-jwt-quan-trọng)
9. [Frontend — Next.js](#9-frontend--nextjs)
10. [Tối ưu hiệu năng](#10-tối-ưu-hiệu-năng)
11. [Docker](#11-docker)
12. [Biến môi trường](#12-biến-môi-trường)
13. [Git & Commit](#13-git--commit)
14. [Testing (bắt buộc)](#14-testing-bắt-buộc-sau-khi-hoàn-thành)
15. [Checklist trước khi hoàn thành](#15-checklist-trước-khi-hoàn-thành)
16. [Mẫu prompt cho AI](#16-mẫu-prompt-cho-ai)

---

## 1. Tech Stack

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Ngôn ngữ | TypeScript (strict mode) | Cấm dùng `any` |
| Backend | NestJS (bản LTS mới nhất) | REST API, prefix `/api` |
| Frontend | Next.js (App Router) | Server Components mặc định |
| Database | MongoDB + Mongoose | Qua `@nestjs/mongoose` |
| Xác thực | JWT (Access + Refresh Token) | Lưu trong **httpOnly cookie** |
| Hash mật khẩu | `argon2` (ưu tiên) hoặc `bcrypt` (cost ≥ 12) | |
| Validate BE | `class-validator` + `class-transformer` | |
| Validate FE | `zod` + `react-hook-form` | |
| Styling FE | Tailwind CSS | |
| Test BE | Jest + Supertest + mongodb-memory-server | Unit + E2E |
| Test FE | Vitest + Testing Library + MSW + Playwright | Component + E2E |
| Container | Docker + Docker Compose | Multi-stage build |
| Package manager | `pnpm` (hoặc `npm`, thống nhất 1 loại) | |

---

## 2. Cấu trúc thư mục

```
project-root/
├── backend/                     # NestJS API
│   ├── src/
│   │   ├── common/              # Dùng chung toàn app
│   │   │   ├── decorators/      # @CurrentUser, @Roles, @Public
│   │   │   ├── filters/         # Bắt lỗi toàn cục
│   │   │   ├── guards/          # JwtAuthGuard, RolesGuard
│   │   │   ├── interceptors/    # Chuẩn hoá response
│   │   │   ├── pipes/           # ParseObjectIdPipe
│   │   │   ├── dto/             # PaginationDto...
│   │   │   └── constants/
│   │   ├── config/              # Cấu hình + validate env
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── dto/
│   │   │   │   ├── strategies/  # jwt.strategy.ts, jwt-refresh.strategy.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.module.ts
│   │   │   └── users/
│   │   │       ├── dto/
│   │   │       ├── schemas/     # user.schema.ts
│   │   │       ├── users.controller.ts
│   │   │       ├── users.service.ts
│   │   │       ├── users.repository.ts
│   │   │       └── users.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── frontend/                    # Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── (marketing)/     # Landing page (public, SEO)
│   │   │   ├── (auth)/          # login, register
│   │   │   ├── (dashboard)/     # Page cần đăng nhập
│   │   │   ├── layout.tsx
│   │   │   └── not-found.tsx
│   │   ├── components/
│   │   │   ├── ui/              # Button, Input, Modal (thuần UI)
│   │   │   ├── sections/        # Hero, Features, Pricing (landing)
│   │   │   └── features/        # Component gắn nghiệp vụ
│   │   ├── hooks/
│   │   ├── lib/                 # api-client.ts, utils.ts
│   │   ├── services/            # Gọi API theo domain
│   │   ├── schemas/             # zod schemas
│   │   ├── types/
│   │   └── middleware.ts        # Chặn route chưa đăng nhập
│   ├── public/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
└── AI_CODING_RULES.md           # File này
```

**Quy tắc:**
- Mỗi module NestJS là **một thư mục độc lập** (controller, service, repository, dto, schema).
- FE: component chỉ UI đặt ở `components/ui`, KHÔNG gọi API trong đó.
- Không tạo file "utils" khổng lồ — tách theo chức năng (`date.util.ts`, `string.util.ts`).

---

## 3. Quy tắc chung cho AI

### ✅ LUÔN LUÔN
1. Đọc cấu trúc dự án hiện có trước khi tạo file mới — **tái sử dụng**, không viết trùng.
2. Viết TypeScript **strict**, có kiểu dữ liệu rõ ràng cho tham số và giá trị trả về.
3. Validate **mọi** dữ liệu đầu vào (body, query, params) ở BE.
4. Xử lý lỗi rõ ràng, không nuốt lỗi (`catch {}` rỗng là cấm).
5. Chú thích bằng **tiếng Việt** (xem mục 5).
6. Khi tạo endpoint mới → nêu rõ có cần đăng nhập không, role nào được dùng.
7. Liệt kê các file đã tạo/sửa ở cuối câu trả lời.
8. Code phải chạy được ngay trong Docker, không phụ thuộc máy local.
9. Sau khi code xong **PHẢI viết test, chạy test và báo cáo kết quả** (mục 14). Chưa test = chưa xong.

### ❌ KHÔNG BAO GIỜ
1. Hard-code secret, mật khẩu, URL database, API key trong code.
2. Dùng `any`, `@ts-ignore`, `eslint-disable` khi không có lý do ghi rõ trong comment.
3. Lưu JWT trong `localStorage` / `sessionStorage`.
4. Trả về `password`, `refreshTokenHash` hoặc dữ liệu nhạy cảm trong response.
5. Dùng `console.log` trong code production (BE dùng `Logger` của NestJS).
6. Tự ý cài thư viện mới khi thư viện hiện có đã làm được — nếu cần, giải thích lý do.
7. Tự ý xoá / đổi tên file, API đang có mà không báo.
8. Viết function dài quá **40 dòng** hoặc file quá **300 dòng** — hãy tách nhỏ.

### Quy trình làm một tính năng
```
1. Phân tích yêu cầu → liệt kê entity, endpoint, page cần có
2. BE: Schema → DTO → Repository → Service → Controller → Module
3. FE: Type → Zod schema → Service gọi API → Component → Page
4. Viết test + chạy test, tất cả phải PASS (mục 14)
5. Kiểm tra bảo mật (mục 8) + checklist (mục 15)
6. Gửi báo cáo kết quả test (mục 14.12)
```

---

## 4. Clean Code & Đặt tên

### 4.1 Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Biến, hàm | `camelCase` | `getUserById`, `isActive` |
| Class, Interface, Type | `PascalCase` | `UserService`, `CreateUserDto` |
| Hằng số | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS` |
| File BE | `kebab-case.loai.ts` | `users.service.ts`, `create-user.dto.ts` |
| File component FE | `PascalCase.tsx` | `HeroSection.tsx` |
| File khác FE | `kebab-case.ts` | `api-client.ts` |
| Boolean | tiền tố `is/has/can/should` | `isLoading`, `hasPermission` |
| Collection MongoDB | số nhiều, lowercase | `users`, `orders` |

### 4.2 Nguyên tắc
- **Single Responsibility**: mỗi hàm/class làm một việc.
- **DRY**: logic lặp ≥ 2 lần → tách hàm dùng chung.
- **Early return** thay cho `if` lồng nhau.
- Không dùng "magic number/string" → đưa vào `constants`.
- Tham số hàm > 3 → gom thành object.
- Ưu tiên `const`, không dùng `var`.
- Dùng `async/await`, không dùng `.then()` lồng nhau.

```ts
// ❌ Không tốt
async function check(u) {
  if (u) {
    if (u.status === 1) {
      if (u.role === 'admin') return true;
    }
  }
  return false;
}

// ✅ Tốt — early return, có kiểu, không magic value
/**
 * Kiểm tra người dùng có quyền quản trị hay không
 * @param user - Người dùng cần kiểm tra
 * @returns true nếu user đang hoạt động và là admin
 */
function isActiveAdmin(user: User | null): boolean {
  if (!user) return false;
  if (user.status !== UserStatus.ACTIVE) return false;
  return user.role === Role.ADMIN;
}
```

### 4.3 Lint & Format (bắt buộc)
- ESLint + Prettier cho cả BE và FE.
- Prettier: `singleQuote: true`, `semi: true`, `trailingComma: 'all'`, `printWidth: 100`.
- `tsconfig`: `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`.

---

## 5. Quy tắc chú thích tiếng Việt

### 5.1 Khi nào phải viết comment
- **Bắt buộc**: đầu mỗi class, mỗi hàm public, mỗi endpoint, mỗi schema.
- **Bắt buộc**: logic nghiệp vụ phức tạp, thuật toán, các chỗ xử lý bảo mật.
- **Không cần**: code tự giải thích (`const total = price * quantity;`).

### 5.2 Mẫu JSDoc chuẩn

```ts
/**
 * Tạo mới đơn hàng cho người dùng
 *
 * Luồng xử lý:
 * 1. Kiểm tra tồn kho từng sản phẩm
 * 2. Tính tổng tiền (đã áp dụng mã giảm giá)
 * 3. Lưu đơn hàng với trạng thái PENDING
 *
 * @param userId - ID người đặt hàng
 * @param dto - Dữ liệu đơn hàng từ client
 * @returns Đơn hàng vừa được tạo
 * @throws BadRequestException - Khi sản phẩm hết hàng
 */
async createOrder(userId: string, dto: CreateOrderDto): Promise<OrderDocument> { ... }
```

### 5.3 Comment trong code
```ts
// Giải thích "TẠI SAO", không lặp lại "LÀM GÌ"
// ❌ Tăng biến đếm lên 1
// ✅ Đếm số lần đăng nhập sai để khoá tài khoản sau 5 lần

// TODO: [Tên] Mô tả việc cần làm sau
// FIXME: Mô tả lỗi cần sửa
// SECURITY: Đánh dấu đoạn code liên quan bảo mật, không được sửa tuỳ tiện
```

- Tên biến, hàm, class vẫn viết **tiếng Anh**. Chỉ comment là tiếng Việt.
- Thông báo lỗi trả về cho người dùng: tiếng Việt, rõ ràng, không lộ chi tiết hệ thống.

---

## 6. Backend — NestJS

### 6.1 Kiến trúc tầng

```
Controller  → Nhận request, gọi service, KHÔNG chứa logic nghiệp vụ
Service     → Logic nghiệp vụ
Repository  → Truy vấn MongoDB (chỉ tầng này được dùng Model)
Schema      → Định nghĩa cấu trúc dữ liệu
DTO         → Validate dữ liệu vào/ra
```

### 6.2 `main.ts` chuẩn

```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

/**
 * Khởi động ứng dụng NestJS
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // SECURITY: Thêm các HTTP header bảo mật
  app.use(helmet());
  // Đọc cookie để lấy JWT
  app.use(cookieParser());

  // SECURITY: Chỉ cho phép domain frontend gọi API, cho phép gửi cookie
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // Validate toàn cục: loại bỏ field lạ, chặn request có field không khai báo
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableShutdownHooks();

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 API đang chạy tại cổng ${port}`, 'Bootstrap');
}
bootstrap();
```

### 6.3 Chuẩn response

Mọi API trả về cùng một định dạng:

```ts
// Thành công
{ "success": true, "data": { ... }, "message": "Thành công" }

// Có phân trang
{ "success": true, "data": [ ... ], "meta": { "page": 1, "limit": 10, "total": 120, "totalPages": 12 } }

// Lỗi
{ "success": false, "statusCode": 400, "message": "Email không hợp lệ", "path": "/api/users", "timestamp": "..." }
```

```ts
// common/filters/all-exceptions.filter.ts
/**
 * Bắt toàn bộ lỗi và trả về định dạng thống nhất
 * SECURITY: Không trả stack trace ra client ở môi trường production
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttp ? exception.message : 'Lỗi hệ thống, vui lòng thử lại sau';

    // Ghi log lỗi 500 để debug, không gửi chi tiết cho client
    if (!isHttp) this.logger.error(exception);

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 6.4 DTO

```ts
/**
 * Dữ liệu đăng ký tài khoản
 */
export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  // Mật khẩu ≥ 8 ký tự, có chữ hoa, chữ thường, số
  @IsString()
  @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Mật khẩu phải có chữ hoa, chữ thường và số',
  })
  password: string;

  @IsString()
  @Length(2, 50)
  fullName: string;
}
```

- Update dùng `PartialType(CreateXxxDto)` từ `@nestjs/mapped-types`.
- Response DTO dùng `@Exclude()` / `@Expose()` hoặc hàm `toResponse()` để loại field nhạy cảm.

### 6.5 Repository pattern

```ts
/**
 * Tầng truy cập dữ liệu người dùng
 * Chỉ tầng này được phép thao tác trực tiếp với Model
 */
@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  /** Tìm user theo email (kèm password để xác thực đăng nhập) */
  findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  /** Tìm user theo ID, trả về object thuần để tối ưu hiệu năng */
  findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean().exec();
  }
}
```

### 6.6 Config & validate biến môi trường

```ts
// config/env.validation.ts
import * as Joi from 'joi';

/**
 * Validate biến môi trường khi khởi động
 * App sẽ KHÔNG chạy nếu thiếu biến bắt buộc → tránh lỗi âm thầm ở production
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(4000),
  MONGODB_URI: Joi.string().required(),
  FRONTEND_URL: Joi.string().uri().required(),
  // SECURITY: Secret phải đủ dài (≥ 32 ký tự) và khác nhau giữa access/refresh
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES: Joi.string().default('7d'),
});
```

```ts
// app.module.ts
ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidationSchema }),
MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({ uri: config.get<string>('MONGODB_URI') }),
}),
// SECURITY: Giới hạn 100 request / 60 giây / IP
ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
```

### 6.7 Mã HTTP chuẩn
| Code | Khi nào |
|---|---|
| 200 | GET / PATCH thành công |
| 201 | POST tạo mới thành công |
| 204 | DELETE thành công |
| 400 | Dữ liệu không hợp lệ |
| 401 | Chưa đăng nhập / token sai / hết hạn |
| 403 | Đã đăng nhập nhưng không đủ quyền |
| 404 | Không tìm thấy |
| 409 | Trùng dữ liệu (email đã tồn tại) |
| 429 | Gửi quá nhiều request |
| 500 | Lỗi hệ thống |

---

## 7. Database — MongoDB

### 7.1 Schema chuẩn

```ts
/**
 * Schema người dùng
 * - timestamps: tự động thêm createdAt, updatedAt
 * - password & refreshTokenHash: mặc định KHÔNG được select
 */
@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  // SECURITY: select: false → không bao giờ vô tình trả password ra ngoài
  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  // SECURITY: Lưu HASH của refresh token, không lưu token gốc
  @Prop({ select: false, default: null })
  refreshTokenHash: string | null;

  // Dùng để vô hiệu hoá toàn bộ token cũ khi đổi mật khẩu / đăng xuất mọi thiết bị
  @Prop({ default: 0 })
  tokenVersion: number;

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop({ type: Date, default: null })
  lockUntil: Date | null;

  @Prop({ default: null })
  deletedAt: Date | null; // Soft delete
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

// Index cho các trường hay truy vấn
UserSchema.index({ role: 1, createdAt: -1 });
```

### 7.2 Quy tắc truy vấn
- Dùng `.lean()` cho truy vấn chỉ đọc (nhanh hơn, ít RAM hơn).
- Chỉ `select` những field cần thiết.
- **Luôn phân trang** cho API danh sách (mặc định `limit = 10`, tối đa `100`).
- Tạo **index** cho field dùng trong `filter`, `sort`, `unique`.
- Validate `ObjectId` trước khi truy vấn (dùng `ParseObjectIdPipe`).
- Nhiều thao tác phụ thuộc nhau → dùng **transaction** (`session`) — cần MongoDB replica set.
- Tránh N+1: dùng `populate` có chọn field hoặc `$lookup` trong aggregation.

### 7.3 Chống NoSQL Injection
```ts
// SECURITY: Không bao giờ đưa trực tiếp req.body / req.query vào filter
// ❌ this.userModel.find(req.query)
// ✅ Chỉ lấy field đã validate qua DTO
this.userModel.find({ role: dto.role }).lean();
```
- Bật `mongoose.set('sanitizeFilter', true)` để chặn toán tử `$` từ input.
- Với search text: escape ký tự regex trước khi dùng `$regex`.

### 7.4 Phân trang dùng chung
```ts
/**
 * Tham số phân trang dùng chung cho mọi API danh sách
 */
export class PaginationDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 10;
}
```

---

## 8. Bảo mật JWT (QUAN TRỌNG)

> 🔐 Đây là phần **không được thoả hiệp**. AI phải tuân thủ 100%.

### 8.1 Mô hình token

| Token | Thời hạn | Lưu ở đâu | Dùng để |
|---|---|---|---|
| **Access Token** | 15 phút | Cookie `access_token` (httpOnly) | Gọi API |
| **Refresh Token** | 7 ngày | Cookie `refresh_token` (httpOnly, `path=/api/auth`) | Lấy access token mới |

- 2 token dùng **2 secret khác nhau**.
- Payload chỉ chứa: `sub` (userId), `role`, `tokenVersion`. **KHÔNG** chứa email, password, thông tin cá nhân.
- Luôn chỉ định thuật toán khi verify (`algorithms: ['HS256']`) — chặn tấn công `alg: none`.
- Dự án lớn / nhiều service → dùng `RS256` (private key ký, public key verify).

### 8.2 Cấu hình cookie

```ts
// SECURITY: Cấu hình cookie chống XSS & CSRF
export const cookieOptions = (maxAgeMs: number, path = '/'): CookieOptions => ({
  httpOnly: true,                                  // JS phía client không đọc được → chống XSS
  secure: process.env.NODE_ENV === 'production',   // Chỉ gửi qua HTTPS
  sameSite: 'strict',                              // Chống CSRF ('lax' nếu FE/BE khác domain gốc)
  path,
  maxAge: maxAgeMs,
});
```

### 8.3 Luồng xác thực

```
[Đăng nhập]
Client → POST /api/auth/login {email, password}
  → Kiểm tra tài khoản có bị khoá tạm (lockUntil)
  → So sánh mật khẩu bằng argon2.verify
  → Sai: tăng failedLoginAttempts, ≥ 5 lần → khoá 15 phút
  → Đúng: tạo access + refresh token
  → Lưu HASH refresh token vào DB
  → Set 2 cookie httpOnly → trả thông tin user (không có token trong body)

[Gọi API]
Client gửi cookie access_token tự động → JwtAuthGuard verify
  → Kiểm tra tokenVersion khớp DB → cho qua

[Access token hết hạn → 401]
Client → POST /api/auth/refresh (cookie refresh_token)
  → Verify refresh token
  → So sánh với hash trong DB
     ❌ Không khớp → NGHI BỊ ĐÁNH CẮP: xoá refreshTokenHash, tăng tokenVersion, bắt đăng nhập lại
     ✅ Khớp → cấp CẶP TOKEN MỚI (Refresh Token Rotation), lưu hash mới

[Đăng xuất]
POST /api/auth/logout → xoá refreshTokenHash trong DB + xoá 2 cookie

[Đổi mật khẩu / Đăng xuất mọi thiết bị]
→ Tăng tokenVersion → mọi token cũ lập tức vô hiệu
```

### 8.4 Auth Service (mẫu)

```ts
@Injectable()
export class AuthService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_TIME_MS = 15 * 60 * 1000;

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Đăng nhập và cấp cặp token
   * SECURITY: Thông báo lỗi chung chung để không lộ email có tồn tại hay không
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersRepo.findByEmailWithPassword(dto.email);
    const invalidError = new UnauthorizedException('Email hoặc mật khẩu không đúng');

    if (!user) throw invalidError;

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new ForbiddenException('Tài khoản tạm khoá, vui lòng thử lại sau 15 phút');
    }

    const isMatch = await argon2.verify(user.password, dto.password);
    if (!isMatch) {
      await this.handleFailedLogin(user);
      throw invalidError;
    }

    await this.usersRepo.resetLoginAttempts(user.id);
    return this.issueTokens(user);
  }

  /**
   * Tạo access + refresh token, lưu hash refresh token vào DB
   */
  private async issueTokens(user: UserDocument): Promise<AuthResult> {
    const payload: JwtPayload = { sub: user.id, role: user.role, tokenVersion: user.tokenVersion };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES'),
      }),
    ]);

    // SECURITY: Chỉ lưu hash, nếu DB bị lộ kẻ tấn công cũng không dùng được token
    await this.usersRepo.updateRefreshTokenHash(user.id, await argon2.hash(refreshToken));

    return { accessToken, refreshToken, user: toUserResponse(user) };
  }

  /**
   * Làm mới token (Refresh Token Rotation)
   * SECURITY: Nếu refresh token hợp lệ nhưng không khớp DB → token đã bị dùng lại → thu hồi tất cả
   */
  async refresh(userId: string, refreshToken: string): Promise<AuthResult> {
    const user = await this.usersRepo.findByIdWithRefreshHash(userId);
    if (!user?.refreshTokenHash) throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');

    const isValid = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!isValid) {
      await this.usersRepo.revokeAllSessions(user.id); // xoá hash + tăng tokenVersion
      throw new UnauthorizedException('Phát hiện phiên bất thường, vui lòng đăng nhập lại');
    }

    return this.issueTokens(user);
  }
}
```

### 8.5 JWT Strategy đọc từ cookie

```ts
/**
 * Strategy xác thực access token lấy từ cookie
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private readonly usersRepo: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.access_token]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
      algorithms: ['HS256'], // SECURITY: Cố định thuật toán
    });
  }

  /**
   * Chạy sau khi verify chữ ký thành công
   * Kiểm tra tokenVersion để hỗ trợ thu hồi token tức thì
   */
  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.usersRepo.findById(payload.sub);
    if (!user || user.deletedAt || user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn');
    }
    return { id: payload.sub, role: payload.role };
  }
}
```

### 8.6 Guard toàn cục + phân quyền

```ts
// Mặc định MỌI route đều cần đăng nhập. Route công khai phải gắn @Public()
// app.module.ts
providers: [
  { provide: APP_GUARD, useClass: ThrottlerGuard },
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RolesGuard },
],
```

```ts
// Ví dụ sử dụng
@Controller('users')
export class UsersController {
  /** Lấy thông tin người dùng đang đăng nhập */
  @Get('me')
  getMe(@CurrentUser() user: AuthUser) { ... }

  /** Chỉ admin được xem danh sách người dùng */
  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() query: PaginationDto) { ... }
}

@Controller('auth')
export class AuthController {
  // SECURITY: Giới hạn chặt hơn cho login — 5 lần / phút
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) { ... }
}
```

### 8.7 Checklist bảo mật bắt buộc
- [ ] Secret ≥ 32 ký tự ngẫu nhiên (`openssl rand -base64 48`), khác nhau giữa môi trường.
- [ ] Token lưu trong **httpOnly cookie**, không có trong response body, không trong localStorage.
- [ ] Refresh token được **hash** trong DB và **rotation** mỗi lần refresh.
- [ ] Có cơ chế thu hồi token (`tokenVersion`).
- [ ] Mật khẩu hash bằng `argon2` / `bcrypt(12)`.
- [ ] Rate limit cho `/auth/login`, `/auth/register`, `/auth/forgot-password`.
- [ ] Khoá tạm tài khoản sau 5 lần đăng nhập sai.
- [ ] `helmet`, CORS chỉ cho phép `FRONTEND_URL`, `credentials: true`.
- [ ] `ValidationPipe` với `whitelist` + `forbidNonWhitelisted`.
- [ ] Kiểm tra **quyền sở hữu** tài nguyên (user A không sửa được dữ liệu của user B).
- [ ] Không log token, mật khẩu.
- [ ] Production chạy HTTPS.

---

## 9. Frontend — Next.js

### 9.1 Nguyên tắc chung
- Dùng **App Router**, mặc định là **Server Component**. Chỉ thêm `'use client'` khi cần state, event, hook trình duyệt.
- Đẩy `'use client'` xuống component **lá** càng sâu càng tốt.
- Không gọi API trong component `ui/`.
- Mọi form: `react-hook-form` + `zod`, hiển thị lỗi tiếng Việt.
- Có đủ 3 trạng thái: **loading** (`loading.tsx` / skeleton), **error** (`error.tsx`), **empty**.

### 9.2 Theo loại trang

| Loại | Cách render | Ghi chú |
|---|---|---|
| **Landing Page** | Static (SSG) / ISR (`revalidate`) | Ưu tiên SEO, tốc độ, không cần đăng nhập |
| **Page chức năng cơ bản** | Server Component fetch + Client Component cho form | CRUD, bảng, form |
| **Page logic** | Server Component + Server Actions / Client fetch | Cần đăng nhập, phân quyền |

### 9.3 Landing Page — quy tắc
- Chia thành các section: `HeroSection`, `FeaturesSection`, `PricingSection`, `FaqSection`, `CtaSection`, `Footer`.
- Khai báo `metadata` đầy đủ (title, description, Open Graph, canonical).
- Có `sitemap.ts`, `robots.ts`.
- Dùng `next/image` (có `width`, `height`, `alt`), `priority` cho ảnh Hero.
- Dùng `next/font` để tránh nhảy layout.
- Semantic HTML: 1 thẻ `<h1>` / trang, `<section>`, `<nav>`, `<footer>`.
- Responsive mobile-first; mục tiêu Lighthouse ≥ 90 mọi hạng mục.

```tsx
// app/(marketing)/page.tsx
import type { Metadata } from 'next';

/** Metadata SEO cho trang chủ */
export const metadata: Metadata = {
  title: 'Tên sản phẩm — Giải pháp ...',
  description: 'Mô tả ngắn gọn 150-160 ký tự',
  openGraph: { images: ['/og-image.png'] },
};

// Tái tạo trang tĩnh mỗi 1 giờ
export const revalidate = 3600;

/**
 * Trang chủ Landing Page
 */
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
    </main>
  );
}
```

### 9.4 API Client (tự refresh token)

```ts
// lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tránh gọi refresh nhiều lần cùng lúc khi nhiều request cùng bị 401
let refreshPromise: Promise<boolean> | null = null;

/**
 * Gọi API refresh token (cookie tự gửi kèm)
 * @returns true nếu refresh thành công
 */
async function refreshToken(): Promise<boolean> {
  const res = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
  return res.ok;
}

/**
 * Hàm gọi API dùng chung
 * - Luôn gửi kèm cookie (credentials: 'include')
 * - Gặp 401 → tự refresh token 1 lần rồi gọi lại
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (res.status === 401 && retry) {
    refreshPromise ??= refreshToken().finally(() => (refreshPromise = null));
    const ok = await refreshPromise;
    if (ok) return apiFetch<T>(path, options, false);
    window.location.href = '/login';
  }

  const body = await res.json();
  if (!res.ok) throw new ApiError(body.message ?? 'Có lỗi xảy ra', res.status);
  return body.data as T;
}
```

> 💡 Nếu FE và BE khác domain, nên dùng **Next.js rewrites** (`/api/:path*` → BE) để cookie cùng domain, dùng được `sameSite: 'strict'`.

### 9.5 Middleware bảo vệ route

```ts
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

// Các route cần đăng nhập
const PROTECTED_PATHS = ['/dashboard', '/profile', '/admin'];
// Các route chỉ dành cho khách (đã đăng nhập thì không vào nữa)
const GUEST_PATHS = ['/login', '/register'];

/**
 * Chuyển hướng người dùng dựa vào trạng thái đăng nhập
 * Lưu ý: Đây chỉ là lớp UX. Bảo mật thật sự nằm ở Backend (JwtAuthGuard)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has('access_token') || req.cookies.has('refresh_token');

  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !hasSession) {
    const url = new URL('/login', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (GUEST_PATHS.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|favicon.ico|images|api).*)'] };
```

### 9.6 Bảo mật FE
- Không dùng `dangerouslySetInnerHTML`; nếu bắt buộc → sanitize bằng `DOMPurify`.
- Chỉ biến `NEXT_PUBLIC_*` mới lộ ra trình duyệt → **không** đặt secret với tiền tố này.
- Kiểm tra `redirect` param chỉ là đường dẫn nội bộ (bắt đầu bằng `/`, không phải `//`) → chống Open Redirect.
- Thêm security headers trong `next.config.js` (CSP, `X-Frame-Options`, `Referrer-Policy`).

---

## 10. Tối ưu hiệu năng

### Backend
- `.lean()` + `select` field cần thiết.
- Index cho field filter/sort; kiểm tra bằng `explain()` với truy vấn nặng.
- Dùng `Promise.all` cho các tác vụ độc lập.
- Bật `compression()` cho response.
- Cache dữ liệu ít thay đổi (`@nestjs/cache-manager`, Redis khi cần).
- Không trả về dữ liệu thừa; phân trang mọi danh sách.

### Frontend
- Server Component mặc định → giảm JS gửi xuống client.
- `next/dynamic` cho component nặng (chart, editor, modal) không cần ngay.
- `next/image`, `next/font`, không import cả thư viện (`import { debounce } from 'lodash-es'`).
- `useMemo` / `useCallback` chỉ khi đo thấy cần — không lạm dụng.
- Debounce ô tìm kiếm (300ms).
- Dùng `fetch` với `cache` / `revalidate` hợp lý; `Suspense` để stream từng phần.
- `output: 'standalone'` để image Docker nhẹ.

---

## 11. Docker

### 11.1 Backend — `backend/Dockerfile`

```dockerfile
# ===== Giai đoạn 1: Cài dependencies =====
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ===== Giai đoạn 2: Build source =====
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Stage "builder" vẫn giữ devDependencies → dùng làm target để chạy test (mục 14.11)

# ===== Giai đoạn 3: Loại bỏ devDependencies =====
FROM builder AS pruner
RUN npm prune --omit=dev

# ===== Giai đoạn 4: Image chạy production (nhẹ, không chứa source) =====
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# SECURITY: Chạy bằng user không phải root
RUN addgroup -S app && adduser -S app -G app
COPY --from=pruner --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/package.json ./
USER app

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1
CMD ["node", "dist/main.js"]
```

### 11.2 Frontend — `frontend/Dockerfile`

```dockerfile
# Yêu cầu next.config.js có: output: 'standalone'

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Biến NEXT_PUBLIC_* được "nhúng" lúc build nên phải truyền qua build arg
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
USER app

EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
```

### 11.3 `.dockerignore` (cả BE và FE)
```
node_modules
dist
.next
.git
.env
.env.*
!.env.example
*.log
coverage
Dockerfile*
docker-compose*
```

### 11.4 `docker-compose.yml`

```yaml
services:
  # ===== Database MongoDB =====
  mongo:
    image: mongo:7
    container_name: app-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DB_NAME}
    volumes:
      - mongo_data:/data/db
    # SECURITY: Không public cổng Mongo ra ngoài ở production (xoá "ports" trong prod)
    ports:
      - "27017:27017"
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [app-net]

  # ===== Backend NestJS =====
  backend:
    build: ./backend
    container_name: app-backend
    restart: unless-stopped
    env_file: .env
    environment:
      MONGODB_URI: mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASSWORD}@mongo:27017/${MONGO_DB_NAME}?authSource=admin
    depends_on:
      mongo:
        condition: service_healthy
    ports:
      - "4000:4000"
    networks: [app-net]

  # ===== Frontend Next.js =====
  frontend:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    container_name: app-frontend
    restart: unless-stopped
    depends_on: [backend]
    ports:
      - "3000:3000"
    networks: [app-net]

volumes:
  mongo_data:

networks:
  app-net:
    driver: bridge
```

### 11.5 Lệnh thường dùng
```bash
docker compose up -d --build        # Build và chạy toàn bộ
docker compose logs -f backend      # Xem log backend
docker compose down                 # Dừng
docker compose down -v              # Dừng và XOÁ dữ liệu DB (cẩn thận!)
```

### 11.6 Quy tắc Docker
- Luôn **multi-stage build**, image cuối không chứa source TS và devDependencies.
- Chạy bằng **user non-root**.
- Có `HEALTHCHECK` cho backend.
- Không `COPY .env` vào image — truyền qua `env_file` / secrets.
- Cố định version image (`node:20-alpine`, `mongo:7`), không dùng `latest`.
- Production: chỉ public cổng qua reverse proxy (Nginx/Traefik) với HTTPS.

---

## 12. Biến môi trường

### `.env.example`
```bash
# ===== Chung =====
NODE_ENV=development

# ===== MongoDB =====
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=doi_mat_khau_manh_o_day
MONGO_DB_NAME=app_db

# ===== Backend =====
PORT=4000
FRONTEND_URL=http://localhost:3000

# SECURITY: Tạo bằng lệnh: openssl rand -base64 48
JWT_ACCESS_SECRET=thay_bang_chuoi_ngau_nhien_toi_thieu_32_ky_tu
JWT_REFRESH_SECRET=thay_bang_chuoi_ngau_nhien_khac_toi_thieu_32_ky_tu
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# ===== Frontend =====
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

- `.env` **luôn** nằm trong `.gitignore`. Chỉ commit `.env.example`.
- Mỗi môi trường (dev / staging / prod) dùng secret riêng.

---

## 13. Git & Commit

Theo **Conventional Commits**:
```
feat(auth): thêm refresh token rotation
fix(users): sửa lỗi phân trang trả sai tổng số
refactor(orders): tách logic tính giá ra service riêng
docs: cập nhật hướng dẫn chạy docker
chore: nâng cấp nestjs
```
- Nhánh: `main` (production), `develop`, `feature/ten-tinh-nang`, `fix/ten-loi`.
- Không commit `node_modules`, `.env`, `dist`, `.next`.

---

## 14. Testing (BẮT BUỘC sau khi hoàn thành)

> 🧪 Một tính năng chỉ được coi là **HOÀN THÀNH** khi đã có test, test đã chạy và **tất cả đều PASS**.
> AI không được báo "xong" nếu chưa chạy test và chưa báo cáo kết quả.

### 14.1 Quy trình bắt buộc sau khi code xong

```
1. Viết code tính năng
2. Viết Unit Test cho Service / Guard / Util / Component
3. Viết E2E Test cho API (Backend) và luồng chính (Frontend)
4. Chạy lint + type check      → npm run lint && npm run typecheck
5. Chạy toàn bộ test           → npm run test && npm run test:e2e
6. Kiểm tra coverage           → npm run test:cov (đạt ngưỡng mục 14.3)
7. Chạy thử trong Docker       → docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
8. Báo cáo kết quả theo mẫu mục 14.12
```

- Test **FAIL** → sửa **code**, KHÔNG sửa test cho "qua" (trừ khi test viết sai yêu cầu, phải giải thích rõ).
- Sửa bug → **viết test tái hiện bug trước**, rồi mới sửa (đảm bảo bug không quay lại).
- Không dùng `it.skip`, `it.only`, `describe.skip` khi commit.

### 14.2 Công cụ

| Phạm vi | Công cụ | Mục đích |
|---|---|---|
| BE Unit | `jest` + `@nestjs/testing` | Test service, guard, pipe, util riêng lẻ (mock phụ thuộc) |
| BE E2E | `jest` + `supertest` + `mongodb-memory-server` | Gọi API thật, DB ảo trong RAM |
| FE Unit/Component | `vitest` (hoặc `jest`) + `@testing-library/react` + `@testing-library/user-event` | Test component, hook, zod schema |
| FE Mock API | `msw` (Mock Service Worker) | Giả lập API cho component test |
| FE E2E | `playwright` | Test luồng người dùng trên trình duyệt thật |
| Hiệu năng (tuỳ chọn) | `k6` / Lighthouse CI | Kiểm tra tải API, điểm Lighthouse landing page |

### 14.3 Ngưỡng coverage tối thiểu

| Phạm vi | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| Backend (toàn bộ) | 80% | 75% | 80% | 80% |
| Module `auth` + guards (bảo mật) | **95%** | **90%** | **95%** | **95%** |
| Frontend (lib, hooks, schemas) | 80% | 75% | 80% | 80% |
| Frontend components | 70% | 60% | 70% | 70% |

```ts
// backend/jest.config.ts — build FAIL nếu không đạt ngưỡng
coverageThreshold: {
  global: { statements: 80, branches: 75, functions: 80, lines: 80 },
  './src/modules/auth/': { statements: 95, branches: 90, functions: 95, lines: 95 },
  './src/common/guards/': { statements: 95, branches: 90, functions: 95, lines: 95 },
},
```

### 14.4 Quy tắc viết test

- Cấu trúc **AAA**: `Arrange` (chuẩn bị) → `Act` (thực hiện) → `Assert` (kiểm tra).
- Mô tả test bằng **tiếng Việt**, đọc như câu nói: `it('nên trả về 401 khi sai mật khẩu')`.
- Mỗi `it` kiểm tra **một hành vi**.
- Test phải **độc lập**: không phụ thuộc thứ tự chạy, dọn dữ liệu sau mỗi test.
- Không gọi dịch vụ ngoài thật (email, thanh toán...) → mock.
- Dữ liệu test tạo qua **factory** (`test/factories/`), không copy-paste object.
- Test cả **happy path** lẫn **case lỗi** và **case biên** (rỗng, null, quá dài, sai định dạng).
- Không test chi tiết cài đặt nội bộ — test **hành vi** đầu vào/đầu ra.

**Vị trí file:**
```
backend/
├── src/modules/auth/auth.service.spec.ts      # Unit test đặt cạnh file gốc
├── test/
│   ├── auth.e2e-spec.ts                       # E2E test theo module
│   ├── users.e2e-spec.ts
│   ├── factories/user.factory.ts              # Tạo dữ liệu mẫu
│   ├── helpers/test-app.ts                    # Khởi tạo app + DB ảo
│   └── jest-e2e.json
frontend/
├── src/components/features/LoginForm.test.tsx
├── src/schemas/auth.schema.test.ts
├── src/test/setup.ts                          # Cấu hình testing-library, msw
└── e2e/
    ├── auth.spec.ts                           # Playwright
    └── landing.spec.ts
```

### 14.5 Scripts `package.json`

```jsonc
// backend/package.json
"scripts": {
  "lint": "eslint \"{src,test}/**/*.ts\"",
  "typecheck": "tsc --noEmit",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:e2e": "jest --config ./test/jest-e2e.json --runInBand"
}

// frontend/package.json
"scripts": {
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:cov": "vitest run --coverage",
  "test:e2e": "playwright test"
}
```

### 14.6 Backend — Unit Test (mẫu `AuthService`)

```ts
// src/modules/auth/auth.service.spec.ts
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { buildUser } from '../../../test/factories/user.factory';

jest.mock('argon2');

/**
 * Unit test cho AuthService
 * Toàn bộ phụ thuộc (repository, jwt, config) đều được mock
 */
describe('AuthService', () => {
  let service: AuthService;
  let usersRepo: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmailWithPassword: jest.fn(),
            findByIdWithRefreshHash: jest.fn(),
            updateRefreshTokenHash: jest.fn(),
            resetLoginAttempts: jest.fn(),
            increaseFailedAttempts: jest.fn(),
            revokeAllSessions: jest.fn(),
          },
        },
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue('token') } },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('x'.repeat(32)) } },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    usersRepo = moduleRef.get(UsersRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('nên trả về cặp token khi email và mật khẩu đúng', async () => {
      // Arrange
      usersRepo.findByEmailWithPassword.mockResolvedValue(buildUser());
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed');

      // Act
      const result = await service.login({ email: 'a@test.com', password: 'Password1' });

      // Assert
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user).not.toHaveProperty('password');
      expect(usersRepo.updateRefreshTokenHash).toHaveBeenCalledWith(expect.any(String), 'hashed');
    });

    it('nên báo lỗi chung chung khi email không tồn tại (không lộ thông tin)', async () => {
      usersRepo.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login({ email: 'x@test.com', password: 'Password1' }))
        .rejects.toThrow(new UnauthorizedException('Email hoặc mật khẩu không đúng'));
    });

    it('nên tăng số lần sai khi mật khẩu không đúng', async () => {
      usersRepo.findByEmailWithPassword.mockResolvedValue(buildUser());
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'a@test.com', password: 'Wrong123' }))
        .rejects.toThrow(UnauthorizedException);
      expect(usersRepo.increaseFailedAttempts).toHaveBeenCalled();
    });

    it('nên chặn đăng nhập khi tài khoản đang bị khoá', async () => {
      const lockedUser = buildUser({ lockUntil: new Date(Date.now() + 60_000) });
      usersRepo.findByEmailWithPassword.mockResolvedValue(lockedUser);

      await expect(service.login({ email: 'a@test.com', password: 'Password1' }))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('refresh', () => {
    it('SECURITY: nên thu hồi toàn bộ phiên khi phát hiện refresh token bị dùng lại', async () => {
      usersRepo.findByIdWithRefreshHash.mockResolvedValue(buildUser({ refreshTokenHash: 'hash' }));
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.refresh('userId', 'old-token')).rejects.toThrow(UnauthorizedException);
      expect(usersRepo.revokeAllSessions).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
```

### 14.7 Backend — E2E Test (mẫu luồng xác thực)

```ts
// test/helpers/test-app.ts
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Khởi tạo app NestJS dùng MongoDB ảo trong RAM
 * Cấu hình giống hệt main.ts (pipe, filter, cookie) để test sát thực tế
 */
export async function createTestApp(): Promise<{ app: INestApplication; mongo: MongoMemoryServer }> {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.init();

  return { app, mongo };
}
```

```ts
// test/auth.e2e-spec.ts
import request from 'supertest';

/**
 * E2E test toàn bộ luồng xác thực JWT
 */
describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;
  const account = { email: 'e2e@test.com', password: 'Password1', fullName: 'Người Test' };

  beforeAll(async () => ({ app, mongo } = await createTestApp()));
  afterAll(async () => {
    await app.close();
    await mongo.stop();
  });
  // Dọn DB sau mỗi test để các test độc lập
  afterEach(async () => clearDatabase(app));

  /** Lấy danh sách cookie từ response */
  const getCookies = (res: request.Response): string[] => res.get('Set-Cookie') ?? [];

  it('POST /auth/register → 201, không trả password', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/register').send(account).expect(201);
    expect(res.body.data).not.toHaveProperty('password');
  });

  it('POST /auth/register → 400 khi có field lạ (chống mass assignment)', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ ...account, role: 'admin' })
      .expect(400);
  });

  it('POST /auth/login → set cookie httpOnly, không có token trong body', async () => {
    await registerUser(app, account);
    const res = await request(app.getHttpServer()).post('/api/auth/login').send(account).expect(200);

    const cookies = getCookies(res).join(';');
    expect(cookies).toMatch(/access_token=.*HttpOnly/i);
    expect(cookies).toMatch(/refresh_token=.*HttpOnly/i);
    expect(JSON.stringify(res.body)).not.toMatch(/eyJ/); // Không lộ JWT trong body
  });

  it('GET /users/me → 401 khi không có token', async () => {
    await request(app.getHttpServer()).get('/api/users/me').expect(401);
  });

  it('GET /users/me → 401 khi token bị sửa chữ ký', async () => {
    await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Cookie', 'access_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.fake')
      .expect(401);
  });

  it('SECURITY: refresh token cũ dùng lại → 401 và thu hồi mọi phiên', async () => {
    await registerUser(app, account);
    const login = await request(app.getHttpServer()).post('/api/auth/login').send(account);
    const oldCookies = getCookies(login);

    // Lần 1: refresh hợp lệ → nhận token mới
    await request(app.getHttpServer()).post('/api/auth/refresh').set('Cookie', oldCookies).expect(200);
    // Lần 2: dùng lại token cũ → bị chặn
    await request(app.getHttpServer()).post('/api/auth/refresh').set('Cookie', oldCookies).expect(401);
  });

  it('SECURITY: USER thường gọi API của ADMIN → 403', async () => {
    const cookies = await loginAs(app, account);
    await request(app.getHttpServer()).get('/api/users').set('Cookie', cookies).expect(403);
  });

  it('SECURITY: đăng nhập sai quá nhiều lần → 429', async () => {
    const attempts = Array.from({ length: 6 }, () =>
      request(app.getHttpServer()).post('/api/auth/login').send({ ...account, password: 'Wrong123' }),
    );
    const results = await Promise.all(attempts);
    expect(results.some((r) => r.status === 429)).toBe(true);
  });

  it('SECURITY: chặn NoSQL injection ở login', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: { $ne: null } })
      .expect(400);
  });
});
```

### 14.8 Danh sách test bảo mật BẮT BUỘC

Mọi dự án có đăng nhập phải có đủ các test sau:

| # | Kịch bản | Kết quả mong đợi |
|---|---|---|
| 1 | Gọi API bảo vệ không có token | 401 |
| 2 | Token sai chữ ký / bị sửa payload | 401 |
| 3 | Token hết hạn | 401 |
| 4 | Token dùng thuật toán `alg: none` | 401 |
| 5 | Dùng refresh token làm access token (và ngược lại) | 401 |
| 6 | Refresh token cũ dùng lại sau khi đã rotation | 401 + thu hồi phiên |
| 7 | Token cũ sau khi đổi mật khẩu / logout | 401 |
| 8 | USER gọi API ADMIN | 403 |
| 9 | User A sửa/xoá dữ liệu của User B | 403 hoặc 404 |
| 10 | Gửi field lạ (`role`, `isAdmin`) khi đăng ký/cập nhật | 400 |
| 11 | Payload NoSQL injection (`{ "$ne": null }`) | 400 |
| 12 | Đăng nhập sai liên tiếp | Khoá tài khoản / 429 |
| 13 | Response không chứa `password`, `refreshTokenHash` | Đúng |
| 14 | Cookie có `HttpOnly`, `SameSite`, `Secure` (prod) | Đúng |
| 15 | ObjectId không hợp lệ ở params | 400 (không phải 500) |

### 14.9 Frontend — Unit / Component Test

```ts
// src/schemas/auth.schema.test.ts
import { describe, it, expect } from 'vitest';
import { loginSchema } from './auth.schema';

/** Test validate form đăng nhập */
describe('loginSchema', () => {
  it('nên hợp lệ với email và mật khẩu đúng định dạng', () => {
    expect(loginSchema.safeParse({ email: 'a@test.com', password: 'Password1' }).success).toBe(true);
  });

  it('nên báo lỗi tiếng Việt khi email sai định dạng', () => {
    const result = loginSchema.safeParse({ email: 'abc', password: 'Password1' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Email không hợp lệ');
  });
});
```

```tsx
// src/components/features/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw-server';
import { LoginForm } from './LoginForm';

/**
 * Test component form đăng nhập
 * API được giả lập bằng MSW, không gọi backend thật
 */
describe('LoginForm', () => {
  it('nên hiển thị lỗi khi bỏ trống các trường', async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument();
  });

  it('nên hiển thị thông báo lỗi từ server khi sai mật khẩu', async () => {
    server.use(
      http.post('*/auth/login', () =>
        HttpResponse.json({ success: false, message: 'Email hoặc mật khẩu không đúng' }, { status: 401 }),
      ),
    );
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'a@test.com');
    await userEvent.type(screen.getByLabelText(/mật khẩu/i), 'Wrong123');
    await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    expect(await screen.findByText('Email hoặc mật khẩu không đúng')).toBeInTheDocument();
  });

  it('nên vô hiệu hoá nút khi đang gửi để tránh submit 2 lần', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'a@test.com');
    await userEvent.type(screen.getByLabelText(/mật khẩu/i), 'Password1');
    await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    expect(screen.getByRole('button', { name: /đang xử lý/i })).toBeDisabled();
  });
});
```

**Quy tắc component test:**
- Tìm phần tử theo **vai trò người dùng thấy** (`getByRole`, `getByLabelText`), hạn chế `getByTestId`.
- Test `apiFetch`: tự refresh khi 401, chỉ refresh 1 lần khi nhiều request đồng thời, chuyển về `/login` khi refresh thất bại.
- Test `middleware.ts`: chưa đăng nhập vào `/dashboard` → redirect `/login`; tham số `redirect` ngoài domain bị bỏ qua.

### 14.10 Frontend — E2E Test (Playwright)

```ts
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

/**
 * E2E luồng đăng nhập trên trình duyệt thật
 * Chạy với toàn bộ hệ thống (FE + BE + Mongo) trong Docker
 */
test.describe('Luồng xác thực', () => {
  test('người dùng đăng nhập thành công và vào dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('demo@test.com');
    await page.getByLabel('Mật khẩu').fill('Password1');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('SECURITY: JavaScript không đọc được token (httpOnly)', async ({ page }) => {
    await loginViaUi(page);
    const cookieFromJs = await page.evaluate(() => document.cookie);
    expect(cookieFromJs).not.toContain('access_token');
  });

  test('chưa đăng nhập vào /dashboard → chuyển về /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard/);
  });
});
```

```ts
// e2e/landing.spec.ts
/** Kiểm tra Landing Page: hiển thị, SEO, responsive */
test.describe('Landing Page', () => {
  test('có đủ các section chính và 1 thẻ h1', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('link', { name: /bắt đầu/i })).toBeVisible();
  });

  test('có meta description và og:image', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });

  test('hiển thị tốt trên mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // Không bị tràn ngang
    const hasOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(hasOverflow).toBe(false);
  });
});
```

**Luồng E2E tối thiểu theo loại trang:**
- **Landing Page:** hiển thị các section, link CTA hoạt động, meta SEO, mobile không tràn, Lighthouse ≥ 90.
- **Page chức năng:** tạo → xem danh sách → sửa → xoá (có xác nhận), tìm kiếm, phân trang, validate form.
- **Page logic:** đăng nhập, đăng xuất, hết hạn phiên tự refresh, phân quyền theo role, các nghiệp vụ chính.

### 14.11 Chạy test trong Docker

```yaml
# docker-compose.test.yml
# Môi trường test tách biệt, dữ liệu xoá sạch sau khi chạy xong
services:
  mongo-test:
    image: mongo:7
    tmpfs: /data/db              # Lưu trong RAM, tự mất khi dừng
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      retries: 10

  backend-test:
    build:
      context: ./backend
      target: builder            # Dùng stage builder (có devDependencies để chạy test)
    environment:
      NODE_ENV: test
      MONGODB_URI: mongodb://mongo-test:27017/app_test
      FRONTEND_URL: http://localhost:3000
      JWT_ACCESS_SECRET: test_access_secret_chi_dung_cho_test_32_ky_tu
      JWT_REFRESH_SECRET: test_refresh_secret_chi_dung_cho_test_32_ky_tu
    command: sh -c "npm run lint && npm run typecheck && npm run test:cov && npm run test:e2e"
    depends_on:
      mongo-test:
        condition: service_healthy

  frontend-test:
    build:
      context: ./frontend
      target: builder
    command: sh -c "npm run lint && npm run typecheck && npm run test:cov"
```

> 💡 Stage `builder` giữ devDependencies (jest, supertest...), còn stage `pruner` mới xoá chúng, nên image production vẫn nhẹ.

```bash
# Chạy toàn bộ test trong Docker, container dừng khi test xong, trả mã lỗi nếu FAIL
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from backend-test

# Dọn dẹp sau khi test
docker compose -f docker-compose.test.yml down -v
```

**Thứ tự trong CI (GitHub Actions / GitLab CI):**
```
Lint → Type check → Unit test + Coverage → E2E Backend → Build Docker image → E2E Playwright → Deploy
```
Bất kỳ bước nào FAIL → dừng pipeline, **không deploy**.

### 14.12 Mẫu báo cáo test (AI phải gửi sau khi hoàn thành)

```markdown
## ✅ Kết quả kiểm thử — [Tên tính năng]

| Loại | Số test | Pass | Fail | Coverage |
|---|---|---|---|---|
| BE Unit | 24 | 24 | 0 | 91% |
| BE E2E | 15 | 15 | 0 | — |
| FE Unit/Component | 12 | 12 | 0 | 84% |
| FE E2E (Playwright) | 6 | 6 | 0 | — |

**Lint / Type check:** ✅ Không lỗi
**Test bảo mật (mục 14.8):** ✅ 15/15
**Docker test:** ✅ Chạy thành công

**Case đã test:** (liệt kê ngắn gọn happy path, case lỗi, case biên)
**Chưa test / hạn chế:** (nêu rõ nếu có, kèm lý do)
**File test đã tạo:** (danh sách đường dẫn)
```

---

## 15. Checklist trước khi hoàn thành

AI phải tự kiểm tra trước khi báo "xong":

**Code**
- [ ] Không có `any`, `console.log`, code thừa, import không dùng.
- [ ] Hàm ≤ 40 dòng, file ≤ 300 dòng.
- [ ] Có JSDoc tiếng Việt cho class / hàm public / endpoint.
- [ ] Đặt tên đúng quy ước mục 4.

**Backend**
- [ ] DTO validate đầy đủ, thông báo lỗi tiếng Việt.
- [ ] Response đúng định dạng chuẩn.
- [ ] Endpoint có guard phù hợp (`@Public` / mặc định / `@Roles`).
- [ ] Kiểm tra quyền sở hữu dữ liệu.
- [ ] Danh sách có phân trang, truy vấn có index.

**Frontend**
- [ ] Có loading / error / empty state.
- [ ] Responsive, có `alt` cho ảnh, semantic HTML.
- [ ] Landing page có metadata SEO.
- [ ] Không lưu token trong localStorage.

**Testing**
- [ ] Đã viết unit test + e2e test cho tính năng mới.
- [ ] Đủ 15 test bảo mật ở mục 14.8 (nếu có xác thực).
- [ ] `npm run test`, `npm run test:e2e` PASS 100%.
- [ ] Đạt ngưỡng coverage mục 14.3.
- [ ] Không còn `it.only` / `it.skip`.
- [ ] Đã gửi báo cáo test theo mục 14.12.

**Bảo mật & Docker**
- [ ] Đã qua checklist mục 8.7.
- [ ] `docker compose up --build` chạy thành công.
- [ ] Không có secret trong code / image.

---

## 16. Mẫu prompt cho AI

### Tạo module Backend
```
Đọc AI_CODING_RULES.md. Tạo module NestJS "products" gồm:
- Schema: name, slug (unique), price, stock, category, isActive
- CRUD đầy đủ, danh sách có phân trang + lọc theo category + tìm theo name
- GET công khai; POST/PATCH/DELETE chỉ ADMIN
Tuân thủ repository pattern, chú thích tiếng Việt, liệt kê file đã tạo.
Sau đó viết unit test + e2e test (gồm test bảo mật mục 14.8), chạy test và báo cáo theo mục 14.12.
```

### Tạo Landing Page
```
Đọc AI_CODING_RULES.md. Tạo landing page cho [sản phẩm] gồm các section:
Hero, Features (6 tính năng), Pricing (3 gói), FAQ, CTA, Footer.
Yêu cầu: Server Component, Tailwind, responsive, metadata SEO, sitemap, Lighthouse ≥ 90.
```

### Tạo Page chức năng
```
Đọc AI_CODING_RULES.md. Tạo trang /dashboard/products:
- Bảng danh sách có phân trang, tìm kiếm (debounce 300ms)
- Modal thêm/sửa dùng react-hook-form + zod
- Xác nhận trước khi xoá
- Có loading, error, empty state
Gọi API qua lib/api-client.ts.
Viết component test (Testing Library + MSW) và Playwright test cho luồng CRUD, chạy và báo cáo kết quả.
```

### Viết test cho code có sẵn
```
Đọc AI_CODING_RULES.md mục 14. Viết test cho module [tên module]:
- Unit test cho service (mock repository), đủ happy path, case lỗi, case biên
- E2E test cho toàn bộ endpoint, gồm các test bảo mật ở mục 14.8
- Đạt ngưỡng coverage mục 14.3
Chạy test, nếu FAIL thì sửa code (không sửa test cho qua) và báo cáo theo mục 14.12.
```

### Review code
```
Đọc AI_CODING_RULES.md. Review đoạn code sau theo checklist mục 15,
đặc biệt phần bảo mật JWT mục 8. Liệt kê vấn đề theo mức độ: Nghiêm trọng / Nên sửa / Gợi ý.
```

---

> 📌 **Ghi nhớ:** Bảo mật > Đúng > Có test > Rõ ràng > Nhanh. Khi phân vân, hãy chọn phương án an toàn hơn và hỏi lại.
