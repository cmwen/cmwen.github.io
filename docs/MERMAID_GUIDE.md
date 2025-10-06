# Mermaid Diagram Support

This blog now supports Mermaid diagrams! You can create flowcharts, sequence diagrams, class diagrams, and more directly in your markdown files.

## How to Use

Simply create a code block with the language `mermaid` and include your diagram syntax:

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
\`\`\`

## Supported Diagram Types

Mermaid supports many diagram types:

### Flowcharts
\`\`\`mermaid
graph LR
    A[Square Rect] --> B((Circle))
    A --> C(Round Rect)
    B --> D{Rhombus}
    C --> D
\`\`\`

### Sequence Diagrams
\`\`\`mermaid
sequenceDiagram
    participant User
    participant Application
    participant LLM
    participant Tool

    User->>Application: Provide input
    Application->>LLM: Send user input and tool descriptions
    LLM->>LLM: Decide whether a tool is needed
    alt Tool is needed
        LLM->>Application: Return tool name and parameters
        Application->>Tool: Execute the tool with parameters
        Tool-->>Application: Return tool result
        Application->>LLM: Send tool result back to LLM
        LLM->>LLM: Continue reasoning with tool result
    end
    LLM-->>Application: Final response
    Application-->>User: Provide final response
\`\`\`

### Class Diagrams
\`\`\`mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
\`\`\`

### State Diagrams
\`\`\`mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\`\`\`

### Entity Relationship Diagrams
\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
\`\`\`

### Gantt Charts
\`\`\`mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2024-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2024-01-12  , 12d
    another task      : 24d
\`\`\`

### Pie Charts
\`\`\`mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
\`\`\`

## Implementation Details

The Mermaid integration uses:
- Client-side rendering with React
- Automatic detection of mermaid code blocks
- Error handling with fallback display
- Responsive design that works on mobile

## Tips

1. **Keep it Simple**: Complex diagrams can be hard to maintain. Break them into smaller, focused diagrams.
2. **Test Locally**: Always preview your diagrams locally before publishing.
3. **Use Comments**: Mermaid supports comments with `%%` - use them to document complex diagrams.
4. **Check the Documentation**: Visit [Mermaid's official documentation](https://mermaid.js.org/) for syntax reference.

## Troubleshooting

If a diagram doesn't render:
1. Check the syntax against Mermaid's documentation
2. Look for syntax errors in the browser console
3. The error message will show the diagram source for debugging

## Example from Existing Posts

Check out these blog posts that already use Mermaid diagrams:
- Tool Calling in LangChain
- Using VS Code Copilot Fetch for RAG
