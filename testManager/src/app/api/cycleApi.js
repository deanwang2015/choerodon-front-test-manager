import { axios, stores } from 'choerodon-front-boot';

const { AppState } = stores;
export function getCycles() {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`/test/v1/projects/${projectId}/cycle/query`);
}

export function getCycleById(cycleId) {
  const projectId = AppState.currentMenuType.id;
  //   return axios.get(`/test/v1/cycle/case/query/${cycleId}`);
  return axios.get(`/test/v1/projects/${projectId}/cycle/case/query/${cycleId}`);
}
export function addCycle(data) {
  const projectId = AppState.currentMenuType.id;
  return axios.post(`/test/v1/projects/${projectId}/cycle`, data);
}
export function editCycleExecute(data) {
  const projectId = AppState.currentMenuType.id;
  return axios.post(`/test/v1/projects/${projectId}/cycle/case/update`, data);
}
export function deleteExecute(executeId) {
  const projectId = AppState.currentMenuType.id;
  return axios.delete(`/test/v1/projects/${projectId}/cycle/case?cycleCaseId=${executeId}`);
}
export function deleteCycleOrFolder(cycleId, type) {
  const projectId = AppState.currentMenuType.id;
  return axios.delete(`/test/v1/projects/${projectId}/cycle`, { cycleId, type });
}
export function clone(cycleId, data, type) {
  const projectId = AppState.currentMenuType.id;
  if (type === 'CLONE_FOLDER') {
    return axios.post(`/test/v1/projects/${projectId}/cycle/clone/folder/${cycleId}`, data);
  } else if (type === 'CLONE_CYCLE') {
    return axios.post(`/test/v1/projects/${projectId}/cycle/clone/cycle/${cycleId}`, data);
  }
  return axios.post(`/test/v1/projects/${projectId}/cycle/clone/folder/${cycleId}`, data);
}

export function addFolder(data) {
  const projectId = AppState.currentMenuType.id;
  return axios.post(`/test/v1/projects/${projectId}/cycle`, data);
}
export function editFolder(data) {
  const projectId = AppState.currentMenuType.id;
  return axios.put(`/test/v1/projects/${projectId}/cycle`, data);
}