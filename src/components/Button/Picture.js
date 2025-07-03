import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

import picture from "../../icons/picture.svg";

import {
  ENTER_DELAY,
  LEAVE_DELAY,
  DATA_MARKDOWN,
  DATA_ORIGIN
} from "../../utils/constant";

import { observer, inject } from "mobx-react";

@inject("navbar")
@inject("resume")
@inject("hint")
@observer
class Picture extends Component {
  /**
   * 使用本地图片
   */

  /**
   * 使用本地图片
   */
  useLocalImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader(); reader.onload = (e) => { resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * 处理图片上传
   */
  uploadPicture = async ({ target }) => {
    const file = document.getElementById("uploadImage").files[0];
    if (!file) return;
    
    const id = this.props.resume.choosenKey;
    if (!id) {
      this.props.hint.setError({
        isOpen: true,
        message: "请先选择一个网格"
      });
      return;
    }
    
    const element = document.getElementById(id);
    const { isMarkdownMode } = this.props.navbar;
    const imageUrl = await this.useLocalImage(file);
    
    if (!imageUrl) return;
    
    let content;
    if (isMarkdownMode) {
      content = `![avatar](${imageUrl})`;
      element.childNodes[0].innerText = content;
      element.setAttribute(DATA_MARKDOWN, content);
    } else {
      content = `<section><p><img src="${imageUrl}" alt="avatar"></p>\n</section>`
      element.childNodes[0].innerHTML = content;
      element.setAttribute(DATA_ORIGIN, content);
    }
  };

  stopPropagation = event => {
    event.stopPropagation();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Tooltip
          title="本地图片"
          placement="bottom"
          enterDelay={ENTER_DELAY}
          leaveDelay={LEAVE_DELAY}
          disableFocusListener
        >
          <Button
            className={classes.btn}
            disabled={this.props.navbar.isDisabled}
            onClick={this.stopPropagation}
            classes={{
              root: classes.minWidth,
              disabled: classes.opacity
            }}
          >
            <input
              accept="image/*"
              className={classes.input}
              id="uploadImage"
              onChange={this.uploadPicture}
              type="file"
            />
            <label htmlFor="uploadImage" className={classes.label}>
              <img src={picture} alt="logo" />
            </label>
          </Button>
        </Tooltip>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    height: "100%"
  },
  input: {
    display: "none",
    width: "100%"
  },
  label: {
    display: "flex",
    height: "100%",
    padding: "6px 10px"
  },
  btn: {
    padding: "0px",
    borderRadius: "0",
    borderBottom: "1px solid #cccccc",
    borderTop: "1px solid #cccccc",
    borderRight: "1px solid #cccccc",
    height: "100%"
  },
  minWidth: {
    minWidth: "auto"
  },
  opacity: {
    opacity: 0.3
  }
});

Picture.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Picture);
