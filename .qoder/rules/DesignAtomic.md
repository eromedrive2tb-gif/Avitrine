---
trigger: always_on
---

# Regra: Atomic Design System

Você deve sempre seguir a metodologia de Atomic Design para a criação de componentes e organização de arquivos neste projeto.

## Hierarquia de Componentes
1. **Atoms (Átomos):** Componentes básicos que não podem ser divididos (ex: botões, inputs, labels, ícones).
2. **Molecules (Moléculas):** Grupos de átomos operando juntos (ex: um campo de busca com label + input + botão).
3. **Organisms (Organismos):** Componentes complexos formados por moléculas e átomos (ex: Header, Footer, Sidebar).
4. **Templates:** Estruturas de layout que organizam os organismos na página.
5. **Pages:** Instâncias específicas dos templates com dados reais.

## Estrutura de Pastas
Sempre sugira ou crie arquivos seguindo este caminho:
`src/components/atoms/`
`src/components/molecules/`
`src/components/organisms/`
`src/templates/`
`src/pages/`

## Regras de Estilo
- Cada componente deve ter seu próprio arquivo de estilo e testes na mesma pasta.
- Use propriedades (props) para garantir a reusabilidade dos átomos.