# PharmaTech — пошаговый деплой

## Вариант A: Через терминал (2 команды)

Откройте **Терминал** в Cursor (Terminal → New Terminal) и выполните:

```bash
# 1. Войти в папку
cd /Users/ais/Cursor/projects/fullstack/pharmatech

# 2. Войти в Vercel (откроется браузер)
npx vercel login

# 3. Деплой
npx vercel --prod
```

При первом запуске Vercel спросит:
- **Set up and deploy?** — Enter  
- **Which scope?** — Enter (ваш аккаунт)  
- **Link to existing project?** — N (нет)  
- **Project name?** — Enter (pharmatech)  
- **Directory?** — Enter (./)

После деплоя появится ссылка вида `pharmatech-xxx.vercel.app`.

**Переменные окружения:** после первого деплоя зайдите на vercel.com → ваш проект → Settings → Environment Variables и добавьте ключи из `.env.local`.

---

## Вариант B: Через сайт Vercel (без терминала)

1. Зарегистрируйтесь на **https://vercel.com** (через GitHub или email)

2. Нажмите **"Add New..."** → **"Project"**

3. Выберите **"Deploy by uploading your project"** (или импорт из Git, если проект в репозитории)

4. Перетащите папку **pharmatech** в окно или нажмите **Browse** и выберите:
   ```
   /Users/ais/Cursor/projects/fullstack/pharmatech
   ```

5. В **Environment Variables** добавьте:
   - `NEXT_PUBLIC_SUPABASE_URL` = (ваше значение)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (ваше значение)
   - `SUPABASE_SERVICE_ROLE_KEY` = (ваше значение)
   - `NEXT_PUBLIC_APP_URL` = `https://ваш-домен.vercel.app` (или оставьте пустым, потом поправите)
   - `ENCRYPTION_KEY` = (32 hex-символа, например сгенерируйте: `openssl rand -hex 16`)

6. Нажмите **Deploy**

7. Через 1–2 минуты сайт будет доступен по ссылке

---

## Откуда взять ключи Supabase

1. Зайдите на **https://supabase.com** → ваш проект  
2. **Settings** → **API**  
3. Скопируйте: **Project URL**, **anon public**, **service_role**

---

## Если что-то не работает

Напишите, на каком шаге возникла проблема и что вы видите на экране.
