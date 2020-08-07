import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  CustomInput,
} from 'reactstrap';
import { Search } from 'react-feather';
import XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export default function Export() {
  const data = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      website: 'hildegard.org',
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      website: 'anastasia.net',
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      website: 'ramiro.info',
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      website: 'kale.biz',
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
      website: 'demarco.info',
    },
    {
      id: 6,
      name: 'Mrs. Dennis Schulist',
      username: 'Leopoldo_Corkery',
      email: 'Karley_Dach@jasper.info',
      website: 'ola.org',
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
      website: 'elvis.io',
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
      website: 'jacynthe.com',
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
      website: 'conrad.com',
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
      website: 'ambrose.net',
    },
  ];
  const [filteredData, setFilteredData] = useState([]);
  const [value, setValue] = useState([]);
  const [modal, setModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileFormat, setFileFormat] = useState('xlsx');

  const handleFilter = (e: any) => {
    let filteredData = [];
    let value = e.target.value;
    setValue(value);
    if (value.length) {
      filteredData = data.filter((col) => {
        let startsWithCondition =
          col.name.toLowerCase().startsWith(value.toLowerCase()) ||
          col.email.toLowerCase().startsWith(value.toLowerCase()) ||
          col.website.toLowerCase().startsWith(value.toLowerCase()) ||
          col.id.toString().toLowerCase().startsWith(value.toLowerCase());

        let includesCondition =
          col.name.toLowerCase().includes(value.toLowerCase()) ||
          col.email.toLowerCase().includes(value.toLowerCase()) ||
          col.website.toLowerCase().includes(value.toLowerCase()) ||
          col.id.toString().toLowerCase().includes(value.toLowerCase());

        if (startsWithCondition) return startsWithCondition;
        else if (!startsWithCondition && includesCondition)
          return includesCondition;
        else return null;
      });
      setValue(value);
      // setFilteredData(filteredData);
    }
  };

  const handleExport = () => {
    setModal(!modal);
    // let table = ReactDOM.findDOMNode(tableRef);
    // let bookType = fileFormat.length ? fileFormat : 'xlsx';
    // let wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet JS' });
    // let wbout = XLSX.write(wb, { bookType, bookSST: true, type: 'binary' });

    // const s2ab = (s: any) => {
    //   var buf = new ArrayBuffer(s.length);
    //   var view = new Uint8Array(buf);
    //   for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    //   return buf;
    // };
    // let file =
    //   fileFormat.length && fileFormat.length
    //     ? `${fileName}.${fileFormat}`
    //     : fileName.length
    //     ? `${fileName}.xlsx`
    //     : fileFormat.length
    //     ? `excel-sheet.${fileFormat}`
    //     : 'excel-sheet.xlsx';

    // return FileSaver.saveAs(
    //   new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    //   file
    // );
  };

  let array = value ? filteredData : data;
  let renderTableData = array.map((col: any) => {
    return (
      <tr key={col.id}>
        <td>{col.email}</td>
        <td>{col.name}</td>
        <td>{col.website}</td>
        <td>{col.id}</td>
      </tr>
    );
  });
  return (
    <>
      <Row className="export-component">
        <Col sm="12">
          <Card>
            <CardBody>
              <Row>
                <Col sm="12">
                  <div className="d-flex justify-content-between flex-wrap">
                    <Button color="primary" onClick={() => setModal(!modal)}>
                      Export
                    </Button>
                    <div className="filter position-relative has-icon-left">
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleFilter(e)}
                      />
                      <div className="form-control-position">
                        <Search size={15} />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col sm="12">
                  <Table
                    // innerRef={(el: any) => (tableRef = el)}
                    className="table-hover-animation mt-2"
                    responsive
                  >
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Receiver</th>
                        <th>Remarks</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>{renderTableData}</tbody>
                  </Table>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={modal}
        toggle={() => setModal(!modal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setModal(!modal)}>
          Export To Excel
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter File Name"
            />
          </FormGroup>
          <FormGroup>
            <CustomInput
              type="select"
              id="selectFileFormat"
              name="customSelect"
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
            >
              <option>xlsx</option>
              <option>csv</option>
              <option>txt</option>
            </CustomInput>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleExport}>
            Export
          </Button>
          <Button color="flat-danger" onClick={() => setModal(!modal)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
