import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Alchemy 설정
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    // 최신 블록 번호 조회
    async function fetchLatestBlockNumber() {
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(latestBlockNumber);
      fetchBlockDetails(latestBlockNumber);
    }

    fetchLatestBlockNumber();
  }, []);

  // 블록 세부 정보 조회
  async function fetchBlockDetails(blockNumber) {
    const block = await alchemy.core.getBlockWithTransactions(blockNumber);
    setBlockDetails(block);
    setTransactions(block.transactions);
  }

  // 트랜잭션 세부 정보 조회
  async function fetchTransactionDetails(transactionHash) {
    const transactionReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
    setSelectedTransaction(transactionReceipt);
  }

  return (
    <div className="App">
      <h1>블록 익스플로러</h1>
      
      {/* 최신 블록 번호 */}
      <div>
        <strong>Latest Block Number:</strong> {blockNumber}
      </div>

      {/* 블록 세부 정보 */}
      {blockDetails && (
        <div>
          <h2>블록 세부 정보</h2>
          <p><strong>Block Number:</strong> {blockDetails.number}</p>
          <p><strong>Hash:</strong> {blockDetails.hash}</p>
          <p><strong>Parent Hash:</strong> {blockDetails.parentHash}</p>
          <p><strong>Timestamp:</strong> {new Date(blockDetails.timestamp * 1000).toLocaleString()}</p>
          <p><strong>Transactions:</strong> {blockDetails.transactions.length}</p>
        </div>
      )}

      {/* 트랜잭션 목록 */}
      {transactions.length > 0 && (
        <div>
          <h2>트랜잭션 목록</h2>
          <ul>
            {transactions.map((tx, index) => (
              <li key={tx.hash}>
                {index + 1}. Hash: {tx.hash}
                <button onClick={() => fetchTransactionDetails(tx.hash)}>세부 정보 보기</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 선택한 트랜잭션 세부 정보 */}
      {selectedTransaction && (
        <div>
          <h2>트랜잭션 세부 정보</h2>
          <p><strong>Transaction Hash:</strong> {selectedTransaction.transactionHash}</p>
          <p><strong>From:</strong> {selectedTransaction.from}</p>
          <p><strong>To:</strong> {selectedTransaction.to}</p>
          <p><strong>Status:</strong> {selectedTransaction.status ? "Success" : "Fail"}</p>
          <p><strong>Gas Used:</strong> {selectedTransaction.gasUsed}</p>
          <p><strong>Block Number:</strong> {selectedTransaction.blockNumber}</p>
        </div>
      )}
    </div>
  );
}

export default App;
