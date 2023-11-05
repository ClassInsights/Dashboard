type Computer = {
  id: number;
  roomId: number;
  name: string;
  isOnline: boolean;
  macAddress?: string;
  ipAddress?: string;
  lastUser?: string;
};

export default Computer;
