export interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  battery_level: number;
  skills: string[];
  tags: string[];
  image_url: string;
  created_at: string;
}

export interface Model {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  image_url: string;
  created_at: string;
  size_gb?: number;
  type?: string;
  scene?: string;
  compatible_devices?: string[];
}

export interface Task {
  id: number;
  name: string;
  device_id: number;
  model_id: number;
  status: string;
  config: Record<string, any>;
  created_at: string;
}

export interface Database {
  devices: Device;
  models: Model;
  tasks: Task;
}