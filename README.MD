# Сборка webpack

Содержит в себе возможность делать проект под:

- Обычную верстку (html, css | scss, typescript, tailwind)

        В webpack.config в вызове функции getModuleRules указать через запятую 'tailwind' | 'scss' | 'ts' 

- Сборку под React c tailwind, css, scss

        В webpack.config в вызове функции getModuleRules указать через запятую 'tailwind' | 'scss' | 'ts'| 'css-modules' && 'react'

### Примечание:

сейчас в сборке используется `dotenv` для чтения файла. Если файл не нужен то лучше его удалить и установить `cross-env`. Далее изменить скрипты в package на:

```
"dev": "cross-env MODE=dev webpack serve",
"build": "cross-env MODE=prod webpack"
```
