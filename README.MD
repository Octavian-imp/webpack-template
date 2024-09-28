# Сборка webpack

Содержит в себе возможность делать проект под:

- Обычную верстку (html, css | scss, typescript, tailwind)

        Надо в webpack.config в вызове функции getModuleRules указать через запятую 'tailwind' | 'scss' | 'ts' 

- Сборку под React c tailwind, css, scss

        Надо в webpack.config в вызове функции getModuleRules указать через запятую 'tailwind' | 'scss' | 'ts' && 'react'
