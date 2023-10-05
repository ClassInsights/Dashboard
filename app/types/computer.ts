type Computer = {
  id: number;
  roomId: number;
  name: string;
  online: boolean;
  macAddress?: string;
  ipAddress?: string;
  lastUser?: string;
  lastSeen?: Date;
};

export default Computer;
