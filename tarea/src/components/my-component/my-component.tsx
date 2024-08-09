import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @State() tareas = []; // Estado para las tareas
  @State() newTarea = {
    id: null, // Añade el ID para diferenciar entre crear y actualizar
    nombre: '',
    descripcion: '',
    fecha_creacion: '',
    fecha_vencimiento: '',
    estado: 'Pendiente',
    prioridad: 'Media',
    responsable: '',
    notas: '',
  };

  // Función para manejar el cambio en los inputs del formulario
  handleInputChange(event:any) {
    const { name, value } = event.target;
    this.newTarea = { ...this.newTarea, [name]: value };
  }

  // Función para crear o actualizar una tarea
  async saveTarea() {
    const url = this.newTarea.id
      ? `http://localhost:3000/tareas/${this.newTarea.id}` // URL para actualizar
      : 'http://localhost:3000/tareas'; // URL para crear

    const method = this.newTarea.id ? 'PUT' : 'POST'; // Método HTTP

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newTarea),
      });

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
      }

      if(this.newTarea.id){
        alert("Tarea actualizada con éxito");
      }else{
        alert("Tarea guardada con éxito");
      }
      // Si la respuesta es exitosa, recarga la lista de tareas
      await this.loadTareas();

      // Limpiar el formulario
      this.clearForm();

    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    }
  }

  // Función para cargar las tareas al iniciar el componente
  async componentWillLoad() {
    await this.loadTareas();
  }

  //Resetar los datos del formulario
  clearForm() {
    this.newTarea = {
      id: null,
      nombre: '',
      descripcion: '',
      fecha_creacion: '',
      fecha_vencimiento: '',
      estado: 'pendiente',
      prioridad: 'media',
      responsable: '',
      notas: '',
    };
  }

  // Función para cargar los datos de la tarea en el formulario para editar
  editTarea(tarea: any) {
    this.newTarea = {
      ...tarea,
      fecha_creacion: this.formatDateForInput(tarea.fecha_creacion),
      fecha_vencimiento: this.formatDateForInput(tarea.fecha_vencimiento),
    }; // Copia los datos de la tarea seleccionada al formulario
  }

  // Función para eliminar una tarea con confirmación
  async deleteTarea(id: any) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta tarea?');

    if (confirmDelete) {
      try {
        await fetch(`http://localhost:3000/tareas/${id}`, {
          method: 'DELETE',
        });

        this.loadTareas();
        this.clearForm();
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
      }
    }
  }

  // Función para cargar las tareas
  async loadTareas() {
    try {
      const response = await fetch('http://localhost:3000/tareas');
      this.tareas = await response.json();
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }

  //Formato de fecha para mostrar
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Meses son 0-indexados
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  render() {
    return (
      <div class="container">
        <div class="card">
          <div class="card-header">
            GESTIÓN DE TAREAS
          </div>
          <div class="card-body">
            <form onSubmit={(event) => { event.preventDefault(); this.saveTarea(); }}>
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre:</label>
                  <input type="text" name="nombre" value={this.newTarea.nombre} onInput={(event) => this.handleInputChange(event)} />
                </div>
                <div class="form-group">
                  <label>Responsable:</label>
                  <input type="text" name="responsable" value={this.newTarea.responsable} onInput={(event) => this.handleInputChange(event)} />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Fecha de Creación:</label>
                  <input type="datetime-local" name="fecha_creacion" value={this.newTarea.fecha_creacion} onInput={(event) => this.handleInputChange(event)} />
                </div>
                <div class="form-group">
                  <label>Fecha de Vencimiento:</label>
                  <input type="datetime-local" name="fecha_vencimiento" value={this.newTarea.fecha_vencimiento} onInput={(event) => this.handleInputChange(event)} />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Estado:</label>
                  <select name="estado" onInput={(event) => this.handleInputChange(event)}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Progreso">En Progreso</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Prioridad:</label>
                  <select name="prioridad" onInput={(event) => this.handleInputChange(event)}>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
              <div class="form-group">
                  <label>Descripción:</label>
                  <textarea name="descripcion" value={this.newTarea.descripcion} onInput={(event) => this.handleInputChange(event)} />
                </div>
                <div class="form-group">
                  <label>Observaciones:</label>
                  <textarea name="notas" value={this.newTarea.notas} onInput={(event) => this.handleInputChange(event)}></textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="submit-button-container">
                  <button type="submit" class="submit-button">{this.newTarea.id ? 'Actualizar Tarea' : 'Crear Tarea'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Responsable</th>
                <th>Fecha de Creación</th>
                <th>Fecha de Vencimiento</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Descripción</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.tareas.map((tarea) => (
                <tr key={tarea.id}>
                  <td>{tarea.nombre}</td>
                  <td>{tarea.responsable}</td>
                  <td>{new Date(tarea.fecha_creacion).toLocaleString()}</td>
                  <td>{new Date(tarea.fecha_vencimiento).toLocaleString()}</td>
                  <td>{tarea.estado}</td>
                  <td>{tarea.prioridad}</td>
                  <td><textarea class="textareacustom" readOnly>{tarea.descripcion}</textarea></td>
                  <td><textarea class="textareacustom" readOnly>{tarea.notas}</textarea></td>
                  <td class="lastrow">
                    <button onClick={() => this.editTarea(tarea)}>Editar</button>&nbsp;
                    <button class="delete-button" onClick={() => this.deleteTarea(tarea.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

}