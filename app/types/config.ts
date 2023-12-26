type Config = {
  teacherGroupId?: string;
  domainSid?: string;
  domainName?: string;
  caSubject?: string;
  schoolYear?: {
    name?: string;
    startDate?: Date;
    endDate?: Date;
  };
  influx?: {
    query?: string;
    token?: string;
    server?: string;
    organisation?: string;
  };
  azureGroupPattern?: string;
};

export default Config;
