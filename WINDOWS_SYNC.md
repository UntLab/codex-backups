# Синхронизация на Windows

Как получить всю работу на другом компьютере с Windows и синхронизировать её.

---

## 1. Подготовка (один раз)

### 1.1 Установить Git для Windows

1. Скачай: https://git-scm.com/download/win
2. Установи с настройками по умолчанию
3. Открой **Git Bash** или **PowerShell**

### 1.2 Настроить Git и доступ к GitHub

```bash
git config --global user.name "Israfil Ibrahim"
git config --global user.email "i@2ai.az"
```

**Вариант A — HTTPS (проще):**

```bash
# Будет запрос логина/пароля при первом push/pull
# Рекомендуется: Personal Access Token вместо пароля
# Создать: GitHub → Settings → Developer settings → Personal access tokens
```

**Вариант B — SSH (удобнее после настройки):**

```bash
# Сгенерировать ключ
ssh-keygen -t ed25519 -C "i@2ai.az" -f "$HOME/.ssh/id_ed25519"

# Показать публичный ключ и добавить в GitHub
cat ~/.ssh/id_ed25519.pub
# Скопировать в: GitHub → Settings → SSH and GPG keys → New SSH key
```

---

## 2. Первый клон (новый компьютер)

```bash
# Папка — куда клонировать (подставь свой путь)
cd C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ

# Клон (все проекты в одном репо — submodules не нужны)
git clone https://github.com/UntLab/codex-backups.git progects
cd progects
```

---

## 3. Куда положить проекты на Windows

На Mac структура такая:

- `~/GPT/progects` — репо с бэкапами
- `~/home-assistant-dashboard` — отдельный проект
- `~/n8n-prompt-manager` — отдельный проект

На Windows проще держать всё внутри клона:

```
C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ\progects\
├── cardsaas\
├── pharmatech\
├── pharmatech-mobile\
├── home-assistant-dashboard\
├── n8n-prompt-manager\
├── config\
│   ├── codex-skills\
│   ├── cursor-skills\
│   └── cursor-rules\
└── scripts\
```

Работай прямо из `progects`, тогда git будет видеть все изменения.

---

## 4. Синхронизация (каждый день / после работы)

### Скачать изменения с GitHub (pull)

```bash
cd C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ\progects
git pull origin main
```

### Отправить изменения на GitHub (push)

```bash
cd C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ\progects
git add -A
git status
git commit -m "backup: описание изменений"
git push origin main
```

---

## 5. Скрипты для Windows (опционально)

Создай `backup-push.bat` в `progects\scripts\`:

```batch
@echo off
cd /d "%~dp0.."
git add -A
git commit -m "backup: %date% %time%" || echo No changes
git push origin main
echo Done.
pause
```

Или PowerShell `backup-push.ps1`:

```powershell
Set-Location (Split-Path $PSScriptRoot)\..
git add -A
$msg = "backup: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $msg 2>$null; if ($LASTEXITCODE -ne 0) { Write-Host "No changes to commit" }
git push origin main
Write-Host "Done."
```

Запускай двойным кликом после работы.

---

## 6. Восстановление config (Cursor / Codex)

После клона продублируй конфиг в нужные места:

```bash
# В Git Bash или PowerShell

# Cursor skills
xcopy /E /I /Y progects\config\cursor-skills "%USERPROFILE%\.cursor\skills"

# Cursor rules  
xcopy /E /I /Y progects\config\cursor-rules "%USERPROFILE%\.cursor\rules"

# Codex skills (если используешь Codex)
xcopy /E /I /Y progects\config\codex-skills "%USERPROFILE%\.codex\skills"
```

Создай папки, если их нет:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\skills"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\rules"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.codex\skills"
```

---

## 7. Схема работы

| Действие          | Mac                              | Windows                       |
|-------------------|----------------------------------|-------------------------------|
| Бэкап на GitHub   | `./scripts/backup-push.sh main`  | `git add -A && git commit -m "..." && git push` |
| Скачать изменения | `./scripts/restore-sync.sh main` | `git pull origin main`        |
| Репо              | `~/GPT/progects`                 | `C:\Users\...\progects`       |

---

## 8. Если что-то пошло не так

**Конфликт при pull:**

```bash
git stash
git pull origin main
git stash pop
# Разрешить конфликты вручную, затем:
git add -A
git commit -m "merge: resolved conflicts"
git push origin main
```

**Забыл пароль / токен:**

- HTTPS: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- SSH: сгенерируй новый ключ и добавь его в GitHub

---

## Кратко

1. Установи Git, настрой имя/email и доступ к GitHub.
2. Сделай `git clone` в `progects`.
3. Работай в `progects`, делай `git add`, `commit`, `push` после изменений.
4. На другом ПК — `git pull`.
