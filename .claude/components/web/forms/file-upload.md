# File Upload Component

## Structure
```
<div (dropzone)> → <icon> + <text> + <input type="file" hidden> + <preview list?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| accept | `string` | no | Accepted file types |
| maxSize | `number` | no | Max file size in bytes |
| multiple | `boolean` | no | Allow multiple files |
| onUpload | `(files) => void` | yes | Upload handler |

## Variants
- **default** — Click to browse button
- **dropzone** — Drag-and-drop area with dashed border
- **avatar** — Circular image upload with preview

## Build Notes
- Drag states: highlight border on dragover
- Preview: show thumbnail for images, icon + name for others
- Progress: show upload progress bar per file
- Validation: check file type and size before upload
