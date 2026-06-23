import api from '../../services/api';
import {
  TaskResponseDto, TaskCreateDto, TaskUpdateDto, TaskStatus,
  RapportCreateDto, RapportResponseDto, TaskUpdateStatusDto
} from './types';

export const taskService = {
  async getTasks(): Promise<TaskResponseDto[]> {
    const response = await api.get<TaskResponseDto[]>('/task');
    return response.data;
  },
  async getTaskDetail(id: string): Promise<TaskResponseDto> {
    const response = await api.get<TaskResponseDto>(`/task/${id}`);
    return response.data;
  },
  async createTask(taskDto: TaskCreateDto): Promise<TaskResponseDto> {
    const response = await api.post<TaskResponseDto>('/task', taskDto);
    return response.data;
  },
  async updateTask(id: string, taskDto: TaskUpdateDto): Promise<TaskResponseDto> {
    const response = await api.put<TaskResponseDto>(`/task/${id}`, taskDto);
    return response.data;
  },
  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskResponseDto> {
    const payload: TaskUpdateStatusDto = { status };
    const response = await api.put<TaskResponseDto>(`/task/${id}/statut`, payload);
    return response.data;
  },
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/task/${id}`);
  },
  async getPlanningTasks(chantierId: string): Promise<TaskResponseDto[]> {
    const response = await api.get<TaskResponseDto[]>(`/task/planning/${chantierId}`);
    return response.data;
  },
  async createRapport(rapportDto: RapportCreateDto): Promise<RapportResponseDto> {
    const response = await api.post<RapportResponseDto>('/rapports', rapportDto);
    return response.data;
  },
  async getRapportsByChantier(chantierId: string): Promise<RapportResponseDto[]> {
    const response = await api.get<RapportResponseDto[]>(`/rapports/${chantierId}`);
    return response.data;
  }
};