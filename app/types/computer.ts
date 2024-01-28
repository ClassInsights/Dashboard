type Computer = {
  id: number;
  roomId: number;
  name: string;
  macAddress?: string;
  ipAddress?: string;
  lastUser?: string;
  lastSeen?: Date;
  isOnline: boolean;
};

export default Computer;
