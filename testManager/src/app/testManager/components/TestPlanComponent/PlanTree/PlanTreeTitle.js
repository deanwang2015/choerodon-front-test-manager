import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Menu, Input, Dropdown, Button, Popover, Tooltip, 
} from 'choerodon-ui';
import { FormattedMessage } from 'react-intl';
import './PlanTreeTitle.scss';
import { editFolder, deleteCycleOrFolder } from '../../../api/cycleApi';
import CycleStore from '../../../store/project/cycle/CycleStore';

@observer
class PlanTreeTitle extends Component {
  state = {
    editing: false,
  }

  
  handleItemClick = ({ item, key, keyPath }) => {
    const { data, refresh } = this.props;
    const { type, cycleId } = data;
    // window.console.log(this.props.data, { item, key, keyPath });
    switch (key) {
      case 'add': {
        this.props.callback(data, 'ADD_FOLDER');
        break;
      }
      case 'edit': {
        if (type === 'folder') {
          this.setState({
            editing: true,
          });
        } else {
          this.props.callback(data, 'EDIT_CYCLE');
        }
        break;
      }
      case 'delete': {
        deleteCycleOrFolder(cycleId).then((res) => {
          if (res.failed) {
            Choerodon.prompt('删除失败');
          } else {
            CycleStore.setCurrentCycle({});
            refresh();
          }
        }).catch((err) => {

        });
        break;
      }
      case 'clone': {
        if (type === 'folder') {
          this.props.callback(data, 'CLONE_FOLDER');
          // cloneFolder(cycleId, data).then((data) => {

          // });
        } else if (type === 'cycle') {
          this.props.callback(data, 'CLONE_CYCLE');
        }
        // this.props.refresh();
        break;
      }
      case 'export': {
        this.props.callback(data, 'EXPORT_CYCLE');
        break;
      }
      default: break;
    }
  }

  handleEdit = (data) => {
    editFolder(data).then((res) => {
      if (res.failed) {
        Choerodon.prompt('文件夹名字重复');
      } else {
        this.props.refresh();
      }
    });
    this.setState({
      editing: false,
    });
  }

  render() {
    const getMenu = (type) => {
      let items = [];
      if (type === 'temp') {
        items.push(
          <Menu.Item key="export">
          导出循环
          </Menu.Item>,
        );
      } else if (type === 'folder' || type === 'cycle') {
        if (type === 'cycle') {
          items.push(
            <Menu.Item key="add">
              <FormattedMessage id="cycle_addFolder" />
            </Menu.Item>,
          );
        }
        items = items.concat([
          <Menu.Item key="edit">
            {type === 'folder' ? <FormattedMessage id="cycle_editFolder" /> : <FormattedMessage id="cycle_editCycle" />}
          </Menu.Item>,
          <Menu.Item key="delete">
            {type === 'folder' ? <FormattedMessage id="cycle_deleteFolder" /> : <FormattedMessage id="cycle_deleteCycle" />}
          </Menu.Item>,
          <Menu.Item key="clone">
            {type === 'folder' ? <FormattedMessage id="cycle_cloneFolder" /> : <FormattedMessage id="cycle_cloneCycle" />}
          </Menu.Item>,
          <Menu.Item key="export">
            {type === 'folder' ? <FormattedMessage id="cycle_exportFolder" /> : <FormattedMessage id="cycle_exportCycle" />}
          </Menu.Item>,
        ]);
      }
      return <Menu onClick={this.handleItemClick} style={{ margin: '10px 0 0 28px' }}>{items}</Menu>;
    };

    const { editing } = this.state;
    const {
      title, processBar, data, statusList, 
    } = this.props;
    const ProcessBar = {};
    const content = [];
    for (let i = 0; i < statusList.length; i += 1) {
      const status = statusList[i];
      if (processBar[status.statusColor]) {
        ProcessBar[status.statusColor] = processBar[status.statusColor];
        content.push(
          <div style={{ display: 'flex', width: 100 }}>
            <div>{status.statusName}</div>
            <div className="c7n-flex-space" />
            <div>{processBar[status.statusColor]}</div>
          </div>,
        );
      }
    }

    return (
      <div className="c7n-tree-title">
        {editing
          ? (
            <Input
              style={{ width: 78 }}
              defaultValue={this.props.text}
              autoFocus
              onBlur={(e) => {
                this.handleEdit({
                  cycleId: data.cycleId,
                  cycleName: e.target.value,
                  type: 'folder',
                  objectVersionNumber: data.objectVersionNumber,
                });
              }}
            />
          )
          : (
            <div className="c7n-tree-title-text">
              <Tooltip title={title}>
                {title}
              </Tooltip>
            </div>
          )}        
        <div role="none" className="c7n-tree-title-actionButton" onClick={e => e.stopPropagation()}>
          {/* {data.type === 'temp'
            ? null : */}
          <Dropdown overlay={getMenu(data.type)} trigger={['click']}>
            <Button shape="circle" icon="more_vert" />
          </Dropdown>
          {/* } */}
        </div>

      </div>
    );
  }
}

export default PlanTreeTitle;
