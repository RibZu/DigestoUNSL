# auth/login

Página de ingreso (`/login`), se llega desde el botón "Ingresar" del pie. Es una maqueta: no guarda sesión y, al enviar un formulario válido, lleva al panel, `/login/panel` (con `replace`, para que "Atrás" no vuelva al formulario).

El formulario se valida solo con atributos HTML, resueltos por el navegador, sin lógica de validación en JavaScript:

- **Correo** (`type="email"`): obligatorio, con formato de correo de cualquier dominio (`pattern` que además exige un punto en el dominio) y hasta 254 caracteres.
- **Contraseña**: obligatoria, hasta 128 caracteres.

Si algo no se cumple, el navegador bloquea el envío y señala el campo. Con CSS (`:user-invalid`) el campo se marca en rojo y muestra su mensaje `invalid-feedback`; como `:user-invalid` solo se activa después de que la persona interactúa o intenta enviar, el formulario no arranca en rojo. Los tres campos son controlados y llevan `autoComplete`.
