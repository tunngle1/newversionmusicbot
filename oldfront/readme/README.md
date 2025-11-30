# 🎵 Hitmo Music Parser

Простой и эффективный парсер для извлечения музыки с сайта [rus.hitmotop.com](https://rus.hitmotop.com). Получайте прямые ссылки на MP3-файлы, метаданные треков и обложки альбомов.

## ✨ Возможности

- 🔍 **Поиск треков** по названию или исполнителю
- 📥 **Прямые ссылки** на MP3-файлы для скачивания
- 🎨 **Обложки альбомов** в высоком качестве
- ⏱️ **Метаданные** (название, исполнитель, длительность)
- 🚀 **Простой API** - всего несколько строк кода
- 🔒 **Без авторизации** - не требуется регистрация

## 📦 Установка

### Требования

- Python 3.7+
- pip

### Зависимости

```bash
pip install httpx beautifulsoup4
```

## 🚀 Быстрый старт

```python
from hitmo_parser import HitmoParser

# Создать парсер
parser = HitmoParser()

# Поиск треков
tracks = parser.search("Imagine Dragons", limit=10)

# Вывести результаты
for track in tracks:
    print(f"{track['artist']} - {track['title']}")
    print(f"Скачать: {track['url']}")
    print()

# Закрыть соединение
parser.close()
```

## 📖 Документация API

### `HitmoParser()`

Создает экземпляр парсера.

```python
parser = HitmoParser()
```

### `search(query: str, limit: int = 20) -> List[Dict]`

Поиск треков по запросу.

**Параметры:**
- `query` (str) - Поисковый запрос (название трека, исполнитель)
- `limit` (int) - Максимальное количество результатов (по умолчанию: 20)

**Возвращает:**
Список словарей с информацией о треках:

```python
{
    "id": "track_id",              # ID трека
    "title": "Natural",            # Название
    "artist": "Imagine Dragons",   # Исполнитель
    "duration": 190,               # Длительность в секундах
    "url": "https://...",          # Прямая ссылка на MP3
    "image": "https://..."         # URL обложки
}
```

**Пример:**

```python
results = parser.search("The Weeknd", limit=5)
```

### `close()`

Закрывает HTTP-соединение.

```python
parser.close()
```

## 💡 Примеры использования

### Поиск и скачивание

```python
from hitmo_parser import HitmoParser
import requests

parser = HitmoParser()

# Найти треки
tracks = parser.search("Billie Eilish", limit=3)

# Скачать первый трек
if tracks:
    track = tracks[0]
    response = requests.get(track['url'])
    
    filename = f"{track['artist']} - {track['title']}.mp3"
    with open(filename, 'wb') as f:
        f.write(response.content)
    
    print(f"Скачано: {filename}")

parser.close()
```

### Создание плейлиста

```python
from hitmo_parser import HitmoParser
import json

parser = HitmoParser()

# Поиск нескольких исполнителей
artists = ["Coldplay", "Imagine Dragons", "OneRepublic"]
playlist = []

for artist in artists:
    tracks = parser.search(artist, limit=5)
    playlist.extend(tracks)

# Сохранить в JSON
with open('playlist.json', 'w', encoding='utf-8') as f:
    json.dump(playlist, f, ensure_ascii=False, indent=2)

print(f"Создан плейлист из {len(playlist)} треков")

parser.close()
```

### Получение информации о треке

```python
from hitmo_parser import HitmoParser

parser = HitmoParser()

tracks = parser.search("Bohemian Rhapsody Queen", limit=1)

if tracks:
    track = tracks[0]
    
    mins = track['duration'] // 60
    secs = track['duration'] % 60
    
    print(f"🎵 {track['title']}")
    print(f"👤 {track['artist']}")
    print(f"⏱️  {mins}:{secs:02d}")
    print(f"🖼️  {track['image']}")
    print(f"📥 {track['url']}")

parser.close()
```

### Использование с FastAPI

```python
from fastapi import FastAPI
from hitmo_parser import HitmoParser

app = FastAPI()
parser = HitmoParser()

@app.get("/search")
async def search_music(q: str, limit: int = 10):
    tracks = parser.search(q, limit=limit)
    return {"results": tracks}

@app.on_event("shutdown")
def shutdown():
    parser.close()
```

## 🎯 Формат данных

### Track Object

```typescript
{
  id: string,        // Уникальный ID трека
  title: string,     // Название трека
  artist: string,    // Исполнитель
  duration: number,  // Длительность в секундах
  url: string,       // Прямая ссылка на MP3
  image: string      // URL обложки альбома
}
```

## ⚠️ Важные замечания

1. **Легальность**: Используйте парсер только для личных целей. Уважайте авторские права.

2. **Rate Limiting**: Не делайте слишком много запросов подряд. Добавьте задержки между запросами:

```python
import time

for query in queries:
    tracks = parser.search(query)
    time.sleep(1)  # Пауза 1 секунда
```

3. **Обработка ошибок**: Всегда проверяйте результаты:

```python
tracks = parser.search("query")
if not tracks:
    print("Ничего не найдено")
```

## 🔧 Устранение неполадок

### Пустой результат

Если `search()` возвращает пустой список:

- Проверьте интернет-соединение
- Убедитесь, что сайт доступен
- Попробуйте другой поисковый запрос

### Ошибка подключения

```python
try:
    tracks = parser.search("query")
except Exception as e:
    print(f"Ошибка: {e}")
```

### Медленный поиск

Уменьшите `limit` или проверьте скорость интернета:

```python
tracks = parser.search("query", limit=5)  # Меньше результатов
```

## 📝 Лицензия

MIT License - используйте свободно для личных проектов.

## 🤝 Вклад

Нашли баг или хотите улучшить парсер? Создайте Issue или Pull Request!

## 📧 Контакты

Вопросы и предложения приветствуются!

---

**Сделано с ❤️ для любителей музыки**
